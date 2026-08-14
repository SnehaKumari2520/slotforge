import { type TimeSlot, doIntervalsOverlap, isValidInterval } from "../utils/time.js";
import { prisma } from "../db.js";

// Make sure TimeSlot includes title if needed, or pass title explicitly
export interface CreateSlotInput extends TimeSlot {
  title?: string;
}

export class SlotEngine {
  async addSlot(newSlot: CreateSlotInput) {
    // Step A: Reject invalid intervals
    if (!isValidInterval(newSlot)) {
      throw new Error("End time must be after start time");
    }

    // Step B: Fetch stored slots from SQLite to check for overlaps
    const existingSlots = await prisma.slot.findMany();

    for (const existingSlot of existingSlots) {
      // Map Prisma database fields to TimeSlot shape
      const slotToCheck: TimeSlot = {
        startTime: existingSlot.startTime, // Pass Date objects directly
        endTime: existingSlot.endTime,
      };

      if (doIntervalsOverlap(slotToCheck, newSlot)) {
        throw new Error("Slot overlaps with an existing slot");
      }
    }

    // Step C: Save new slot to the SQLite database
    return await prisma.slot.create({
      data: {
        title: newSlot.title || "Untitled Slot", // Provide a default title if missing
        startTime: new Date(newSlot.startTime),
        endTime: new Date(newSlot.endTime),
      },
    });
  }

  async getSlots() {
    return await prisma.slot.findMany({
      orderBy: { startTime: "asc" },
    });
  }

  async deleteSlot(id: string){
    const existing = await prisma.slot.findUnique({where : {id}});
    if(!existing){
      throw new Error("SLOT NOT FOUND")
    }

    // Delete and return the result
  return await prisma.slot.delete({
    where: { id },
  });

  }
}


    

