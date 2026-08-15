import { type TimeSlot, doIntervalsOverlap, isValidInterval } from "../utils/time.js";
import { prisma } from "../db.js";

export interface CreateSlotInput {
  title?: string;
  startTime: string | Date;
  endTime: string | Date;
}

export class SlotEngine {
  async addSlot(newSlot: CreateSlotInput) {
    // Normalize newSlot into pure Date objects for accurate comparison
    const newSlotFormatted: TimeSlot = {
      startTime: new Date(newSlot.startTime),
      endTime: new Date(newSlot.endTime),
    };

    // Step A: Reject invalid intervals
    if (!isValidInterval(newSlotFormatted)) {
      throw new Error("End time must be after start time");
    }

    // Step B: Fetch stored slots from SQLite to check for overlaps
    const existingSlots = await prisma.slot.findMany();

    for (const existingSlot of existingSlots) {
      const slotToCheck: TimeSlot = {
        startTime: existingSlot.startTime,
        endTime: existingSlot.endTime,
      };

      if (doIntervalsOverlap(slotToCheck, newSlotFormatted)) {
        throw new Error("Slot overlaps with an existing slot");
      }
    }

    // Step C: Save new slot to SQLite database
    return await prisma.slot.create({
      data: {
        title: newSlot.title || "Untitled Slot",
        startTime: newSlotFormatted.startTime,
        endTime: newSlotFormatted.endTime,
      },
    });
  }

  async getSlots() {
    return await prisma.slot.findMany({
      orderBy: { startTime: "asc" },
    });
  }

  async deleteSlot(id: string) {
    const existing = await prisma.slot.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("SLOT NOT FOUND");
    }

    return await prisma.slot.delete({
      where: { id },
    });
  }
}

    

