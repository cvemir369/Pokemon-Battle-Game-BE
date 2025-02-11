import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BASE_URL_FRONTEND, JWT_SECRET } from "../config/config.js";

// Get all users
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get user by id
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  res.status(200).json(user);
});

// Create a new user
export const createUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }

    if (await User.findOne({ email })) {
      return next(new ErrorResponse("Email is already taken", 400));
    }

    if (await User.findOne({ username })) {
      return next(new ErrorResponse("Username is already taken", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = jwt.sign({ email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
    });
    await newUser.save();

    // Send email verification
    const message = {
      email: newUser.email,
      subject: "Email Verification",
      message: `Click on the link to verify your email: ${BASE_URL_FRONTEND}/users/verify/${newUser.verificationToken}`,
    };
    console.log(message);

    res.status(201).json(newUser);
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
});

// Verify user by email
export const verifyUser = asyncHandler(async (req, res, next) => {
  const { verificationToken } = req.params;
  const decoded = jwt.verify(verificationToken, JWT_SECRET);
  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  user.isVerified = true;
  await user.save();
  res.status(200).json(user);
});

// Update user by id
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const { username, email, password } = req.body;
  if (email && (await User.findOne({ email }))) {
    return next(new ErrorResponse("Email is already taken", 400));
  }

  if (username && (await User.findOne({ username }))) {
    return next(new ErrorResponse("Username is already taken", 400));
  }

  if (password) {
    req.body.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updatedUser);
});

// Delete user by id
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  await User.findByIdAndDelete(user._id);
  res.status(200).json({ message: "User deleted successfully" });
});

// Set user image - profile picture
export const setUserImage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  user.image = req.body.image; // req.file is the image file but we can use pokemon image from API as well
  await user.save();
  res.status(200).json(user);
});

// Set user score, wins, losses, calculate winLossRatio and gamesPlayed
export const setUserStats = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  user.score = req.body.score;
  user.wins = req.body.wins;
  user.losses = req.body.losses;
  if (user.wins + user.losses === 0) {
    user.winLossRatio = 0;
    user.gamesPlayed = 0;
  } else {
    user.winLossRatio = (user.wins / (user.wins + user.losses)).toFixed(2);
    user.gamesPlayed = user.wins + user.losses;
  }
  await user.save();

  // Update leaderboard
  const leaderboard = await Leaderboard.findOne({ user_id: user._id });
  if (leaderboard) {
    leaderboard.score = user.score;
    await leaderboard.save();
  } else {
    await Leaderboard.create({ user_id: user._id });
  }
  res.status(200).json(user);
});

// Add pokemon to user's roster
export const addPokemon = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  if (user.roster.includes(req.body.pokemonId)) {
    return next(new ErrorResponse("Pokemon already in roster", 400));
  }
  user.roster.push(req.body.pokemonId);
  await user.save();
  res.status(200).json(user);
});

// Remove pokemon from user's roster
export const removePokemon = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  if (!user.roster.includes(req.body.pokemonId)) {
    return next(new ErrorResponse("Pokemon not found in roster", 404));
  }
  user.roster = user.roster.filter((id) => id !== req.body.pokemonId);
  await user.save();
  res.status(200).json(user);
});

// Login user
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.cookie("token", token, { httpOnly: true });
  res.status(200).json({
    message: "User logged in successfully",
    token: { token },
    user: { id: user._id, username: user.username, email: user.email },
  });
});

// Logout user
export const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
});
