import mongoose from "mongoose";
import config from "./config";
import app from "./app";

async function server() {
  try {
    await mongoose.connect(config.database_url);
    console.log("mongoose is connnected");

    app.listen(config.port, () => {
      console.log(`server is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to connect to mongoose:", error);
  }
}

server();
