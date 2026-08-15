import express from "express";
import { SlotEngine } from "./engine/SlotEngine.js";
import {CreateSlotSchema} from "./schema/slot.schema.js";

const app = express();

import cors from "cors";

// Add this right after const app = express();
app.use(cors());
const engine = new SlotEngine();

// ⚠️ THIS LINE IS REQUIRED to parse JSON requests from Postman
app.use(express.json());

app.post("/api/slots", async (req, res) => {
  try {
    

    const validatedData = CreateSlotSchema.parse(req.body);
    
    // Pass the body parameters to the engine
    const newSlot = await engine.addSlot(validatedData);
    
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

app.delete("/api/slots/:id",async(req,res) =>{
  try{

    const {id} = req.params;
    await engine.deleteSlot(id);
    res.status(200).json({message : "slot deleted successfully"})

  } catch(error: any){

    res.status(400).json({ error: error.message });

  }

});