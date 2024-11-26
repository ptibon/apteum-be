import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import apiRouter from "./routes/api";
import cors from "cors";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

// Cors
app.use(cors(corsOptions));

// Routes
app.use("/", apiRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
