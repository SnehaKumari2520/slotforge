import express from "express";
import cors from "cors";
import { SlotEngine } from "./engine/SlotEngine.js";
import { CreateSlotSchema } from "./schema/slot.schema.js";

const app = express();
const PORT = process.env.PORT || 3000;
const engine = new SlotEngine();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Create a new slot
app.post("/api/slots", async (req, res) => {
  try {
    const validatedData = CreateSlotSchema.parse(req.body);
    const newSlot = await engine.addSlot(validatedData);
    res.status(201).json(newSlot);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Fetch all slots
app.get("/api/slots", async (req, res) => {
  try {
    const slots = await engine.getSlots();
    res.status(200).json(slots);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Delete a slot by ID
app.delete("/api/slots/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await engine.deleteSlot(id);
    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// --- SERVER INITIALIZATION ---
app.listen(PORT, () => {
  console.log(`🚀 Engine server running on port ${PORT}`);
});