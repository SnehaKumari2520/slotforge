export interface TimeSlot {
  startTime: Date | string;
  endTime: Date | string;
}

export function isValidInterval(slot: TimeSlot): boolean {
  const start = new Date(slot.startTime).getTime();
  const end = new Date(slot.endTime).getTime();
  return end > start;
}

export function doIntervalsOverlap(slotA: TimeSlot, slotB: TimeSlot): boolean {
  const startA = new Date(slotA.startTime).getTime();
  const endA = new Date(slotA.endTime).getTime();
  const startB = new Date(slotB.startTime).getTime();
  const endB = new Date(slotB.endTime).getTime();

  // Overlap Formula: (StartA < EndB) AND (EndA > StartB)
  return startA < endB && endA > startB;
}