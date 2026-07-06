import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL as string,
  openai_api_key: process.env.OPENAI_API_KEY as string,
  gemini_api_key: process.env.GEMINI_API_KEY as string,
};
