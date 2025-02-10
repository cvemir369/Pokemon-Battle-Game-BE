import mongoose from "mongoose";
const { Schema, model } = mongoose;

const leaderboardSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, default: Date.now },
});

// Virtual field for win/loss ratio
leaderboardSchema.virtual("winLossRatio").get(function () {
  if (this.user_id.wins + this.user_id.losses === 0) {
    return 0;
  }
  return (
    this.user_id.wins /
    (this.user_id.wins + this.user_id.losses)
  ).toFixed(2);
});

// Ensure virtual fields are serialized
leaderboardSchema.set("toJSON", { virtuals: true });
leaderboardSchema.set("toObject", { virtuals: true });

export default model("Leaderboard", leaderboardSchema);
