import { Router } from "express";
import isUserVerified from "../middlewares/isUserVerified.js";
import isUserAuthorized from "../middlewares/isUserAuthorized.js";
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
  .put(isUserAuthorized, updateUser)
  .delete(isUserAuthorized, deleteUser)
  .patch(isUserAuthorized, setUserImage);

// set user stats
userRouter.route("/:id/stats").patch(isUserAuthorized, setUserStats);

// add, remove pokemon from user's roster
userRouter
  .route("/:id/roster")
  .patch(isUserAuthorized, addPokemon)
  .delete(isUserAuthorized, removePokemon);

// verify user, login, logout
userRouter.route("/verify/:verificationToken").post(verifyUser);
userRouter.route("/login").post(isUserVerified, loginUser);
userRouter.route("/logout").post(logoutUser);

export default userRouter;
