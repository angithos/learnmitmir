import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: Request
) {
  try {
    console.log("API KEY LENGTH:", process.env.OPENAI_API_KEY?.length);
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Generate 3 simple german vocabulary questions",
        },
      ],
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: completion.choices[0].message.content,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: "OpenAI call failed" }),
      { status: 500 }
    );
  }
}
