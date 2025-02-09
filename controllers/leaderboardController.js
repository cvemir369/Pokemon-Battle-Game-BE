import { isValidObjectId } from "mongoose";
import Leaderboard from "../models/Leaderboard.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const getAllScores = asyncHandler(async (req, res, next) => {
  const scores = await Leaderboard.find();
  res.json(scores);
});

export const createScore = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const newScore = await Leaderboard.create({ ...body });
  res.status(201).json(newScore);
});
