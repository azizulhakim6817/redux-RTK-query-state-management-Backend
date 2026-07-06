import mongoose, { model } from "mongoose";
import { IUser } from "../interface/user.interface";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: false },
);

export const UserModel = model<IUser>("users", userSchema);
