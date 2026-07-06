import { Router } from "express";
import taskRouter from "./router/task.router";
import userRouter from "./router/user.router";

const router = Router();

router.use("/user", userRouter);
router.use("/task", taskRouter);
export default router;
