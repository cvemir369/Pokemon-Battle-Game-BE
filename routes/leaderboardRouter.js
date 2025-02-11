import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";

const leaderboardRouter = Router();

leaderboardRouter.route("/").get(getLeaderboard);

export default leaderboardRouter;
