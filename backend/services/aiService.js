const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateMCQs(text, prompt) {

    const model = genAI.getGenerativeModel({

        model: "gemini-2.5-flash"

    });

    const finalPrompt = `

You are an MCQ Generator.

Study Material:

${text}

Admin Instructions:

${prompt}

Generate ONLY JSON.

Format:

[
{
"question":"",
"options":["","","",""],
"correctAnswer":0,
"difficulty":"Easy"
}
]

No markdown.
No explanation.
No extra text.

`;

    const result = await model.generateContent(finalPrompt);

    return result.response.text();

}

module.exports = {

    generateMCQs

};