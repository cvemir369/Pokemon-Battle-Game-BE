import { Router } from "express";
import isUserAuthorized from "../middlewares/isUserAuthorized.js";
import {
  getLeaderboard,
  addToLeaderboard,
} from "../controllers/leaderboardController.js";

const leaderboardRouter = Router();

leaderboardRouter.route("/").get(getLeaderboard).post(addToLeaderboard);
// leaderboardRouter.route("/").get(isUserAuthorized, getLeaderboard).post(isUserAuthorized, addToLeaderboard);

export default leaderboardRouter;
