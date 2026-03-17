import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI) // <-- здесь MONGO_URI
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
      console.error("MongoDB connection error:", err);
      console.log("Retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};


connectWithRetry();

// Модель ToDo
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// CRUD API
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.create({ title: req.body.title });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
