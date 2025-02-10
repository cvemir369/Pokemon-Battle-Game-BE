import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  res.status(201).json(newUser);
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

// Login user

// Logout user
