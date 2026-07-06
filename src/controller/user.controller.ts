import { Request, Response } from "express";
import { UserModel } from "../model/user.model";

//create task-------------------------------------------------------
export const createUesr = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = await UserModel.create(body);

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "User creation failed",
      error,
    });
  }
};

//get tasks-----------------------------------------------------------------
export const getUsers = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.find();

    return res.status(200).json({
      success: true,
      message: "Get all users successfully",
      user,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "User creation failed",
      error,
    });
  }
};
// update tasks-----------------------------------------------------------------
export const updateUser = async (req: Request, res: Response) => {
  try {
    let userId = req.params.userId;
    let body = req.body;

    const user = await UserModel.findByIdAndUpdate(userId, body, { new: true });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "User creation failed",
      error,
    });
  }
};
// delete Tasks-----------------------------------------------------------------
export const deleteUser = async (req: Request, res: Response) => {
  try {
    let userId = req.params.userId;

    const user = await UserModel.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleteed successfully",
      user,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "User creation failed",
      error,
    });
  }
};
