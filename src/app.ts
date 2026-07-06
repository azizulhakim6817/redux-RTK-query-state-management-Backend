import express, { Request, Response, urlencoded } from "express";
import router from "./router";
import cors from "cors";
const app = express();

//middeware---------------------
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Home");
});

app.use("/api", router);
export default app;
