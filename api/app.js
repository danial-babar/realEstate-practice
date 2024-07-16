import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL, // Ensure there is no trailing slash here
  // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/auth", authRouter);

app.listen(8800, () => {
  console.log("Server is running!");
});
