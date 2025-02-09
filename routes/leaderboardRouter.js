import { Router } from "express";
import {
  getAllScores,
  createScore,
} from "../controllers/leaderboardController.js";

const leaderboardRouter = Router();

leaderboardRouter.route("/").get(getAllScores).post(createScore);

export default leaderboardRouter;
