import mongoose, { model } from "mongoose";
import { ITask } from "../interface/task.interface";

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      required: true,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    dueDate: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const TaskModel = model<ITask>("tasks", taskSchema);
