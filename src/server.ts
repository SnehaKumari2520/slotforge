import express from "express";
import { SlotEngine } from "./engine/SlotEngine.js";

const app = express();
const engine = new SlotEngine();

// ⚠️ THIS LINE IS REQUIRED to parse JSON requests from Postman
app.use(express.json());

app.post("/api/slots", async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    
    // Pass the body parameters to the engine
    const newSlot = await engine.addSlot({ title, startTime, endTime });
    
    // Return the created slot with HTTP status 201
    res.status(201).json(newSlot);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/slots", async (req, res) => {
  try {
    const slots = await engine.getSlots();
    res.status(200).json(slots);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});