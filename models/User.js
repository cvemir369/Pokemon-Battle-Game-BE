import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username is already taken"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is already taken"],
  },
  password: { type: String, required: [true, "Password is required"] },
  image: { type: String, default: "" }, // Profile picture
  score: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  winLossRatio: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  roster: { type: [Number], default: [] }, // Array of Pokémon IDs from the external API
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false }, // email verification
  verificationToken: { type: String }, // email verification
});

export default model("User", userSchema);
