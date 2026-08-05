// Define what a TimeSlot object looks like
export interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

// Pass slotA and slotB into the function as arguments
 export function doIntervalsOverlap(slotA: TimeSlot, slotB: TimeSlot): boolean {
 return slotA.startTime < slotB.endTime && slotA.endTime > slotB.startTime;
}

// for checking validation
 export function isValidInterval(slot : TimeSlot): boolean {
 return slot.startTime < slot.endTime
}