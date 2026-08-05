import {doIntervalsOverlap , isValidInterval} from '../src/utils/time.js'

// Scenario 1: Overlapping slots (10:00-11:00 vs 10:30-11:30)
const slotA = {
    startTime : new Date("2026-08-04T10:00:00Z"),
    endTime : new Date("2026-08-04T11:00:00Z"),
};

const slotB = {
    startTime : new Date("2026-08-04T10:30:00Z"),
  endTime: new Date("2026-08-04T11:30:00Z"),
};


console.log("Scenario 1 (should be true ): ", doIntervalsOverlap(slotA, slotB));

// Scenario 2 (Back-to-Back): Slot A (10:00 - 11:00) vs Slot B (11:00 - 12:00)

const slotA1 = {

    startTime : new Date("2026-08-04T10:00:00Z"),
    endTime : new Date("2026-08-04T11:00:00Z"),
};

const slotB1 = {
    startTime : new Date("2026-08-04T11:00:00Z"),
  endTime: new Date("2026-08-04T12:00:00Z"),
};
console.log("Scenario 2 (should be back to back) : ", doIntervalsOverlap(slotA1, slotB1));
 
//Scenario 3 (Invalid slot: 11:00 start, 10:00 end)

const slotA2 = {

    startTime : new Date("2026-08-04T11:00:00Z"),
    endTime : new Date("2026-08-04T10:00:00Z"),
};

console.log("Scenario 3 (should be invalid ) : ", isValidInterval(slotA2));


