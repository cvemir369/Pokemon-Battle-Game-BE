import express from "express";
import cors from "cors";
import "./db/index.js";
import { PORT } from "./config/config.js";
import leaderboardRouter from "./routes/leaderboardRouter.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const port = PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/leaderboard", leaderboardRouter);
app.use("*", (req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on port : ${port}`));
