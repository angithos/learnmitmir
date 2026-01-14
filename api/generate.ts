import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import admin from "firebase-admin";

// --- Firebase Admin init (once) ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
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

    // 2️⃣ Input
    const { language, level } = req.body;

    // 3️⃣ Prompt
    const prompt = `
Generate 5 ${level} ${language} translation questions.
Return ONLY valid JSON array:
[
  { "prompt": "...", "answer": "..." }
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const questions = JSON.parse(
      completion.choices[0].message.content!
    );

    // 4️⃣ Store questions
    const batch = db.batch();

    questions.forEach((q: any) => {
      const ref = db
        .collection("users")
        .doc(userId)
        .collection("questions")
        .doc();

      batch.set(ref, {
        prompt: q.prompt,
        answer: q.answer,
        language,
        level,

        // 🧠 Spaced repetition fields
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReview: admin.firestore.Timestamp.now(),

        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate questions" });
  }
}
