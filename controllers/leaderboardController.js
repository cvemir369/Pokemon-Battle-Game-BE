import Leaderboard from "../models/Leaderboard.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const addToLeaderboard = asyncHandler(async (req, res, next) => {
  const { user_id } = req.body;
  if (!user_id) {
    return next(new ErrorResponse("User ID is required", 400));
  }

  const newScore = await Leaderboard.create({ user_id });
  res.status(201).json({ message: "Score submitted", newScore });
});

export const getLeaderboard = asyncHandler(async (req, res, next) => {
  try {
    const leaderboard = await Leaderboard.find()
      .populate({
        path: "user_id",
        select: "username image score gamesPlayed wins losses winLossRatio",
      })
      .exec();

    // Sort the populated data by score
    const sortedLeaderboard = leaderboard.sort(
      (a, b) => b.user_id.score - a.user_id.score
    );

    // Limit to top 10 users
    const top10Leaderboard = sortedLeaderboard.slice(0, 10);

    res.status(200).json({ message: "Top 10 Leaderboard", top10Leaderboard });
  } catch (error) {
    next(new ErrorResponse("Error fetching leaderboard", 500));
  }
});
