import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  setUserImage,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.route("/").get(getUsers).post(createUser);
userRouter
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)
  .patch(setUserImage);

export default userRouter;
