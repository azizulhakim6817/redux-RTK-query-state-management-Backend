import express, { Request, Response, urlencoded } from "express";
import router from "./router";
import cors from "cors";
const app = express();

//middeware---------------------
app.use(
  cors({
    origin: ["http://localhost:5173", "https://reduxrtkclient.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
export default app;
