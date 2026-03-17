import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import sneakerRoutes from "./routes/sneakers.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectWithRetry = () => {
  mongoose.connect('mongodb://mongo_container_LeGoat:27017/sneakershop')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
      console.error("MongoDB connection error:", err);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// Routes
app.use('/api/sneakers', sneakerRoutes);

// Server Start
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));