import { Router } from "express";
import {
  createTasks,
  deleteTasks,
  getTasks,
  updateTasks,
} from "../controller/task.controller";
import {
  createUesr,
  deleteUser,
  getUsers,
  updateUser,
} from "../controller/user.controller";

const userRouter = Router();

userRouter.post("/create", createUesr);
userRouter.patch("/update/:userId", updateUser);
userRouter.delete("/delete/:userId", deleteUser);
userRouter.get("/get", getUsers);

export default userRouter;
