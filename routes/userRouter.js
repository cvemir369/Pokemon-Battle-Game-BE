import { Router } from "express";
import isUserVerified from "../middlewares/isUserVerified.js";
import isUserAuthorized from "../middlewares/isUserAuthorized.js";
import isUserOwner from "../middlewares/isUserOwner.js";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  setUserImage,
  setUserStats,
  addPokemon,
  removePokemon,
  verifyUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";

const userRouter = Router();

// get all users, create user
userRouter.route("/").get(isUserAuthorized, getUsers).post(createUser);

// get, update, delete user, set user image
userRouter
  .route("/:id")
  .get(isUserAuthorized, getUser)
  .put(isUserAuthorized, isUserOwner, updateUser)
  .delete(isUserAuthorized, isUserOwner, deleteUser)
  .patch(isUserAuthorized, isUserOwner, setUserImage);

// set user stats
userRouter
  .route("/:id/stats")
  .patch(isUserAuthorized, isUserOwner, setUserStats);

// add, remove pokemon from user's roster
userRouter
  .route("/:id/roster")
  .patch(isUserAuthorized, isUserOwner, addPokemon)
  .delete(isUserAuthorized, isUserOwner, removePokemon);

// verify user, login, logout
userRouter.route("/verify/:verificationToken").post(verifyUser);
userRouter.route("/login").post(isUserVerified, loginUser);
userRouter.route("/logout").post(logoutUser);

export default userRouter;
