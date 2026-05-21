import express from "express";
import asyncHandler from "express-async-handler";
import Note from "../models/Note.ts";
import User from "../models/User.ts";
import mongoose from "mongoose";

// @desc Get all notes:
// @route GET /notes:
// @access Private

const getAllNotes = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const notes = await Note.find().lean();

    if (!notes?.length) {
      res.status(400).json({ message: "No notes found" });
      return;
    }

    // Add username to each note before sending the response:
    const notesWithUsernames = await Promise.all(
      notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();

        return { ...note, username: user?.username || "Unknown User" };
      }),
    );

    res.json(notesWithUsernames);
  },
);

// @desc Create new note:
// @route POST /notes:
// @access Private

const createNewNote = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { user, title, text } = req.body;

    // Confirm data:
    if (!user || !title || !text) {
      res.status(400).json({ message: "User, title and text are required" });
      return;
    }

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(user)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    // Check if user exists:
    const foundUser = await User.findById(user).lean().exec();

    if (!foundUser) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const note = await Note.create({ user, title, text });

    if (note) {
      res.status(201).json({ message: `New note created` });
    } else {
      res.status(400).json({ message: "Invalid note data received" });
    }
  },
);

// @desc Update a note:
// @route PATCH /notes:
// @access Private

const updateNote = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id, user, title, text, completed } = req.body;

    // Confirm data:
    if (!id || !user || !title || !text || typeof completed !== "boolean") {
      res
        .status(400)
        .json({ message: "ID, user, title, text and completed are required" });
      return;
    }

    // Validate note ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid note ID format" });
      return;
    }

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(user)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const note = await (Note.findById(id).exec() as any);

    if (!note) {
      res.status(400).json({ message: "Note not found" });
      return;
    }

    // Check if user exists:
    const foundUser = await User.findById(user).lean().exec();

    if (!foundUser) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();

    res.json({ message: `${updatedNote.title} updated` });
  },
);

// @desc Delete a note:
// @route DELETE /notes:
// @access Private

const deleteNote = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { id } = req.body;

    // Confirm data:
    if (!id) {
      res.status(400).json({ message: "Note ID required" });
      return;
    }

    // Validate note ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid note ID format" });
      return;
    }

    const note = await (Note.findById(id).exec() as any);

    if (!note) {
      res.status(400).json({ message: "Note not found" });
      return;
    }

    const noteId = note._id;

    await note.deleteOne();

    res.json({ message: `Note with ID ${noteId} deleted` });
  },
);

export { getAllNotes, createNewNote, updateNote, deleteNote };
