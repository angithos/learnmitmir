import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import admin from "firebase-admin";

// --- Firebase Admin init (once) ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // 1️⃣ Verify auth
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await admin.auth().verifyIdToken(token);
    const userId = decoded.uid;

    // 2️⃣ Input: Capture the custom topic typed in by the user
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Missing 'topic' parameter in request body." });
    }

    // 3️⃣ Prompt: Force explicit JSON format containing mixed question types
    const systemInstruction = `
      You are an expert German language teacher. 
      Generate exactly 5 distinct quiz questions focusing exclusively on the German grammar concept: "${topic}".
      
      You must vary the question formats across a mix of these two styles:
      1. "mcq": A multiple choice question testing articles, endings, or syntax. Must include an "options" array.
      2. "typing": A translation prompt asking the user to translate an English sentence to German. Do not provide options.

      Return ONLY a valid JSON array matching this exact object structure:
      [
        {
          "type": "mcq",
          "prompt": "Ich sehe ___ Hund.",
          "answer": "den",
          "options": ["der", "die", "den"],
          "subtopic": "masculine_definite_article",
          "explanation": "Hund is masculine, acting as a direct object (Akkusativ), changing 'der' to 'den'."
        },
        {
          "type": "typing",
          "prompt": "Translate: 'I love you' (informal)",
          "answer": "Ich liebe dich",
          "subtopic": "pronouns",
          "explanation": "'you' acts as the direct object of the verb lieben, changing 'du' to 'dich'."
        }
      ]
    `;

    // Request completing using native JSON constraint options
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: systemInstruction }],
      response_format: { type: "json_object" } // Enforces pure JSON array generation without backticks
    });

    const rawContent = completion.choices[0].message.content!;
    console.log("Raw AI response:", rawContent);
    // Safely wrap parsed output handles if nested fields slip
    let parsedJson = JSON.parse(rawContent);
    
    let questions: any[] = [];
if (Array.isArray(parsedJson)) {
  questions = parsedJson;
} else if (parsedJson.questions && Array.isArray(parsedJson.questions)) {
  questions = parsedJson.questions;
} else if (parsedJson.data && Array.isArray(parsedJson.data)) {
  questions = parsedJson.data;
} else {
  // Fallback if it nested it under a different key entirely
  const firstKey = Object.keys(parsedJson)[0];
  if (firstKey && Array.isArray(parsedJson[firstKey])) {
    questions = parsedJson[firstKey];
  }
}

    // 4️⃣ Store questions in user's profile matching frontend parameters
    const batch = db.batch();

    questions.forEach((q: any) => {
      // Creates an auto-generated random ID document ref
      const ref = db
        .collection("users")
        .doc(userId)
        .collection("questions")
        .doc();

      batch.set(ref, {
        id: ref.id, // Storing the generated document ID right inside the object properties
        topic: topic.toLowerCase().trim(),
        subtopic: q.subtopic || "grammar_practice",
        conceptId: `${topic.toLowerCase().trim()}_sandbox`,
        type: q.type === "mcq" ? "mcq" : "typing",
        prompt: q.prompt,
        answer: q.answer,
        options: q.type === "mcq" ? q.options : null,
        explanation: q.explanation || "",
        
        // 🧠 Spaced repetition fallback baselines
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReview: admin.firestore.Timestamp.now(), // Due immediately
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    // Return the items directly back to your frontend so it can pass them to the renderer
    return res.status(200).json({ success: true, data: questions });
  } catch (err) {
    console.error("Vercel Function Error:", err);
    return res.status(500).json({ error: "Failed to generate sandbox questions" });
  }
}