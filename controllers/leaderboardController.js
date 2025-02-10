import Leaderboard from "../models/Leaderboard.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const createScore = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const newScore = await Leaderboard.create({ ...body });
  res.status(201).json(newScore);
});

export const getLeaderboard = asyncHandler(async (req, res, next) => {
  try {
    const leaderboard = await Leaderboard.find()
      .populate({
        path: "user_id",
        select: "username score wins losses",
      })
      .sort({ "user_id.score": -1 }) // Sort by user's score
      .limit(10) // Limit to top 10 users
      .exec();
    // Convert documents to JSON to include virtual fields
    const leaderboardWithRatio = leaderboard.map((doc) => doc.toJSON());
    res.status(200).json(leaderboardWithRatio);
  } catch (error) {
    next(new ErrorResponse("Error fetching leaderboard", 500));
  }
});
