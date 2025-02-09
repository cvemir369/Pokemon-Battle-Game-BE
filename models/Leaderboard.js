import mongoose from "mongoose";
const { Schema, model } = mongoose;

const leaderboardSchema = new Schema({
  username: { type: String, required: [true, "Username is required"] },
  score: { type: String, required: [true, "Score is required"] },
  date: { type: Date, default: Date.now },
});

export default model("Leaderboard", leaderboardSchema);
