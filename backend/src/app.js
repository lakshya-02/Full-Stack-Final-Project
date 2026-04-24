import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDirectory = path.resolve(__dirname, "../uploads");

const allowedOrigins = [
  process.env.CLIENT_URL,
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsDirectory));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

app.use((error, req, res, next) => {
  if (error?.name === "MulterError") {
    return res.status(400).json({ message: error.message });
  }

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }

  return next(error);
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
