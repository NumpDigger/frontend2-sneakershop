import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Sneaker Model Definition
const sneakerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  imgUrl: { type: String, default: "https://via.placeholder.com/150" }
});

const Sneaker = mongoose.model("Sneaker", sneakerSchema);

// --- CRUD Routes ---

// GET: Получить все кроссовки (Read)
router.get("/", async (req, res) => {
  try {
    const sneakers = await Sneaker.find();
    res.json(sneakers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Добавить новый кроссовок (Create)
router.post("/", async (req, res) => {
  try {
    const newSneaker = await Sneaker.create(req.body);
    res.status(201).json(newSneaker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Обновить кроссовок (Update)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Sneaker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Удалить кроссовок (Delete)
router.delete("/:id", async (req, res) => {
  try {
    await Sneaker.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
