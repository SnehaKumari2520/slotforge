import { type TimeSlot, doIntervalsOverlap, isValidInterval } from "../utils/time.js";

export class SlotEngine {
  private slots: TimeSlot[] = [];

  public addSlot(newSlot: TimeSlot): boolean {
    // Step A: Reject invalid intervals (e.g. end <= start)
    if (!isValidInterval(newSlot)) {
      return false;
    } 
 
    // Step B: Reject overlaps against existing slots
    for (const existingSlot of this.slots) {
      if (doIntervalsOverlap(existingSlot, newSlot)) {
        return false;
      }
    }

    // Step C: Push slot and return success
    this.slots.push(newSlot);
    return true;
  }

  public getSlots(): TimeSlot[] {
    return this.slots;
  }
}


    

