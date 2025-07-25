import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectToDatabase from "./db/dbConnect.js";
import flowchartRouter from "./routes/flowchart.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "http://localhost:3000",
  "https://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS Rejected: ${origin}`);
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/flowchart", flowchartRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
