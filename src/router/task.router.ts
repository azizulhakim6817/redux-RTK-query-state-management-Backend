import { Router } from "express";
import {
  aiStudioGooleSearchTasks,
  complatedTasks,
  createTasks,
  deleteTasks,
  filterTasks,
  getTasks,
  openAiSearchTasks,
  searchTasks,
  updateTasks,
} from "../controller/task.controller";

const taskRouter = Router();

taskRouter.post("/create", createTasks);
taskRouter.patch("/update/:taskID", updateTasks);
taskRouter.patch("/complated/:taskID", complatedTasks);
taskRouter.delete("/delete/:taskID", deleteTasks);
taskRouter.get("/search", searchTasks);
taskRouter.get("/filter", filterTasks);
taskRouter.post("/open/ai/search", openAiSearchTasks);
taskRouter.post("/ai/studio/google/search", aiStudioGooleSearchTasks);
taskRouter.get("/get", getTasks);

export default taskRouter;
