import { Router } from "express";
import {
  getLeaderboard,
  createScore,
} from "../controllers/leaderboardController.js";

const leaderboardRouter = Router();

leaderboardRouter.route("/").get(getLeaderboard).post(createScore);

export default leaderboardRouter;
