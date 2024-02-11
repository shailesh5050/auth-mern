import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import useRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend origin
    credentials: true, // If you need to allow credentials (e.g., cookies)
  })
);

// Middleware
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Routes
app.use("/api/user", useRoutes);
app.use("/api/auth", authRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
