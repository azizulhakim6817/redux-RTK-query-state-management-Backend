# 1. Open AI ===============================

1. .env---> OPENAI_API_KEY=salkfaj;lsadfasd

2. npm install openai

3. এটি তোমার কোডের সমস্যা নয়। OpenAI API তোমার request গ্রহণ করেছে, কিন্তু account-এ API ব্যবহারের জন্য পর্যাপ্ত quota/credit নেই।

# code------------------------------------

```js
//! open ai ----------
import "dotenv/config";
import OpenAI from "openai";
import config from "../config";

const client = new OpenAI({
  apiKey: config.openai_api_key,
});
```

```js
//! open ai Tasks-----------------------------------------------------------------
export const openAiSearchTasks = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    const response = await client.responses.create({
      model: "gpt-5",
      input: `
User search: ${prompt}

Extract the following in JSON:
- search
- priority

Return only valid JSON.
`,
    });

    return res.status(200).json({
      success: true,
      result: response.output_text,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "AI search failed",
      error,
    });
  }
};
```

---

# https://aistudio.google-------------------------------------------

1. terminal --> npm install @google/genai

2. .env----> GEMINI_API_KEY=your_gemini_api_key

3. config--index.ts--> gemini_api_key: process.env.GEMINI_API_KEY,

4. code---------------------
   ``js
   const ai = new GoogleGenAI({
   apiKey: config.gemini_api_key!,
   });

````
```js
export const openAiSearchTasks = async (
  req: Request,
  res: Response
) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a task search assistant.

User request:
"${prompt}"

Extract search filters from the user's request.

Return ONLY raw JSON.

Example:

{
  "search": "React",
  "priority": "HIGH"
}

Rules:
- search = keyword from the request
- priority = HIGH, MEDIUM, LOW or null
- Do NOT explain anything.
- Do NOT wrap the JSON in markdown.
- Do NOT use \`\`\`json.
`,
    });

    // Get Gemini response
    const text = response.text ?? "";

    console.log("Gemini Response:");
    console.log(text);

    // Remove markdown if Gemini still returns it
    const cleanText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const aiResult = JSON.parse(cleanText);

    const query: Record<string, unknown> = {};

    // Search in title OR description
    if (aiResult.search) {
      query.$or = [
        {
          title: {
            $regex: aiResult.search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: aiResult.search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by priority
    if (aiResult.priority) {
      query.priority = aiResult.priority;
    }

    const tasks = await TaskModel.find(query);

    return res.status(200).json({
      success: true,
      aiResult,
      total: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI search failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
```
````
