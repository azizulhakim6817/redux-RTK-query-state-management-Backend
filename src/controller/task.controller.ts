import { ObjectId } from "mongoose";
import { Request, Response } from "express";
import { TaskModel } from "../model/task.model";

//! open ai ----------
import "dotenv/config";
import OpenAI from "openai";
import config from "../config";

const client = new OpenAI({
  apiKey: config.openai_api_key,
});

//! AI studio google.com----------------------
import { GoogleGenAI } from "@google/genai";
//import { TaskModel } from "../models/task.model";

const ai = new GoogleGenAI({
  apiKey: config.gemini_api_key!,
});

//create task-------------------------------------------------------
export const createTasks = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const task = await TaskModel.create(body);

    return res.status(200).json({
      success: true,
      message: "Task created successfully",
      task: task,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Task creation failed",
      error,
    });
  }
};

//get tasks-----------------------------------------------------------------
export const getTasks = async (req: Request, res: Response) => {
  try {
    const task = await TaskModel.find();

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error,
    });
  }
};

// update tasks-----------------------------------------------------------------
export const updateTasks = async (req: Request, res: Response) => {
  try {
    let taskID = req.params.taskID;
    let body = req.body;

    const task = await TaskModel.findByIdAndUpdate(taskID, body, { new: true });

    return res.status(200).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Task creation failed",
      error,
    });
  }
};

// Complated tasks-----------------------------------------------------------------
export const complatedTasks = async (req: Request, res: Response) => {
  try {
    let taskID = req.params.taskID;

    const update = {
      isCompleted: true,
    };

    const task = await TaskModel.findByIdAndUpdate(taskID, update, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Task creation failed",
      error,
    });
  }
};
// delete Tasks-----------------------------------------------------------------
export const deleteTasks = async (req: Request, res: Response) => {
  try {
    let taskID = req.params.taskID;

    const task = await TaskModel.findByIdAndDelete(taskID);

    return res.status(200).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Task creation failed",
      error,
    });
  }
};
// search Tasks-----------------------------------------------------------------
export const searchTasks = async (req: Request, res: Response) => {
  try {
    let search = req.query.search as string;

    const task = await TaskModel.find({
      title: {
        $regex: search,
        $options: "i",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Task creation failed",
      error,
    });
  }
};

// filter Tasks-----------------------------------------------------------------
export const filterTasks = async (req: Request, res: Response) => {
  try {
    const priority = req.query.priority as string;

    const task = await TaskModel.find({
      priority: {
        $regex: priority,
        $options: "i",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Task creation failed",
      error,
    });
  }
};

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

//! AI studio google.com-----------------------------------------------
export const aiStudioGooleSearchTasks = async (req: Request, res: Response) => {
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
