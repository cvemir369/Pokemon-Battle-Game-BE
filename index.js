import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./db/index.js";
import { PORT, BASE_URL_FRONTEND } from "./config/config.js";
import errorHandler from "./middlewares/errorHandler.js";
import leaderboardRouter from "./routes/leaderboardRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use(
  cors({
    origin: BASE_URL_FRONTEND,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
  cookieParser(),
  json()
);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use("/leaderboard", leaderboardRouter);
app.use("/users", userRouter);

app.use("*", (req, res) => res.status(404).json({ message: "Page not found" }));
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port : ${PORT}`));
