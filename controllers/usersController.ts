import express from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../models/User.ts";
import Note from "../models/Note.ts";
import mongoose from "mongoose";

// @desc Get all users:
// @route GET /users:
// @access Private

const getAllUsers = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const users = await User.find().select("-password").lean();

    if (!users?.length) {
      res.status(400).json({ message: "No users found" });
      return;
    }

    res.json(users);
    return;
  },
);

// @desc Create new user:
// @route POST /users:
// @access Private

const createNewUser = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { username, password, roles } = req.body;

    // Confirm data:
    if (!username || !password || !Array.isArray(roles) || roles.length === 0) {
      res
        .status(400)
        .json({ message: "Username, password, and roles are required" });
      return;
    }

    // Check for duplicate username:

    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate) {
      res.status(409).json({ message: "Username already exists" });
      return;
    }

    // Hash password:
    const hashedPassword = await bcrypt.hash(password, 10);

    const userObject = { username, password: hashedPassword, roles };

    // Create and store new user:
    const user = await User.create(userObject);

    if (user) {
      res.status(201).json({ message: `New user ${username} created` });
      return;
    } else {
      res.status(400).json({ message: "Invalid user data received" });
      return;
    }
  },
);

// @desc Update a user:
// @route PATCH /users:
// @access Private

const updateUser = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id, username, password, roles, active } = req.body;

    // Confirm data:
    if (
      !id ||
      !username ||
      !Array.isArray(roles) ||
      roles.length === 0 ||
      typeof active !== "boolean"
    ) {
      res.status(400).json({
        message: "ID, username, roles and active status are required",
      });
      return;
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const user = await (User.findById(id).exec() as any);

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Check for duplicate username:
    const duplicate = await User.findOne({ username }).lean().exec();

    // Allow updates to the original user:
    if (duplicate && duplicate._id.toString() !== id) {
      res.status(409).json({ message: "Username already exists" });
      return;
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
      // Hash password:
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
    return;
  },
);

// @desc Delete a user:
// @route DELETE /users:
// @access Private

const deleteUser = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ message: "User ID required" });
      return;
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const notes = await Note.findOne({ user: id }).lean().exec();

    if (notes) {
      res.status(400).json({
        message: "User has assigned notes. Remove notes before deleting user.",
      });
      return;
    }

    const user = await (User.findById(id).exec() as any);

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const username = user.username;

    const userId = user._id;

    await user.deleteOne();

    res.json({
      message: `User ${username} with ID ${userId} deleted`,
    });
    return;
  },
);

export { getAllUsers, createNewUser, updateUser, deleteUser };
