// utils/ai.js
// Uses Google Gemini's free-tier API (gemini-1.5-flash) to generate MCQs.
// Get a free key (no credit card required for the free tier) at:
//   https://aistudio.google.com/apikey
// Put it in your .env file as GEMINI_API_KEY.

   const MODEL = "gemini-3.1-flash-lite";

async function generateMCQs({ pptText, numQuestions, extraPrompt }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Get a free key at https://aistudio.google.com/apikey and add it to your .env file."
    );
  }

  // Gemini has an input limit, so trim extremely long slide decks.
  const trimmedText = pptText.slice(0, 30000);

  const prompt = `
You are an exam question writer. Based ONLY on the study content below, write exactly ${numQuestions} multiple choice questions (MCQs) suitable for a college-level test.

${extraPrompt ? `Extra instructions from the teacher: ${extraPrompt}` : ""}

Rules:
- Each question must have exactly 4 options: A, B, C, D.
- Only one option should be correct.
- Vary difficulty (easy, medium, hard).
- Do not repeat questions.
- Base every question strictly on the content provided, do not invent unrelated facts.
- Respond with ONLY valid JSON (no markdown fences, no commentary), in exactly this shape:

{
  "questions": [
    {
      "question": "string",
      "options": { "A": "string", "B": "string", "C": "string", "D": "string" },
      "correct": "A"
    }
  ]
}

STUDY CONTENT:
"""
${trimmedText}
"""
`.trim();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Gemini returned no content. Try again or shorten the PPT.");
  }

  const cleaned = rawText.replace(/```json|```/g, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error("Could not parse AI response as JSON. Try regenerating.");
  }

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("AI response did not contain a questions array.");
  }

  return parsed.questions;
}

module.exports = { generateMCQs };
