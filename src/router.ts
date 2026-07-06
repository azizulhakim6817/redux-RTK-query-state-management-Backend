import { Router } from "express";
import taskRouter from "./router/task.router";
import userRouter from "./router/user.router";

const router = Router();

router.use("/task", taskRouter);
router.use("/user", userRouter);
export default router;
