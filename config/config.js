import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const BASE_URL = process.env.BASE_URL;
const BASE_URL_FRONTEND = process.env.BASE_URL_FRONTEND;
const JWT_SECRET = process.env.JWT_SECRET;

export { PORT, MONGO_URI, BASE_URL, BASE_URL_FRONTEND, JWT_SECRET };
