import { SlotEngine } from "../src/engine/SlotEngine.js";
import { type TimeSlot } from "../src/utils/time.js";

const engine = new SlotEngine(); 

// Booking 1: 10:00 - 11:00 (Should succeed -> true)
const booking1: TimeSlot = {
  startTime: new Date("2026-08-04T10:00:00Z"),
  endTime: new Date("2026-08-04T11:00:00Z"),
};  
console.log("Booking 1 (10:00 - 11:00):", engine.addSlot(booking1)); 

// Booking 2: Overlapping 10:30 - 11:30 (Should fail -> false)
const booking2: TimeSlot = {
  startTime: new Date("2026-08-04T10:30:00Z"),
  endTime: new Date("2026-08-04T11:30:00Z"),
};
console.log("Booking 2 (10:30 - 11:30, Overlap):", engine.addSlot(booking2)); 

// Booking 3: Back-to-back 11:00 - 12:00 (Should succeed -> true)
const booking3: TimeSlot = {
  startTime: new Date("2026-08-04T11:00:00Z"),
  endTime: new Date("2026-08-04T12:00:00Z"),
};
console.log("Booking 3 (11:00 - 12:00, Clean):", engine.addSlot(booking3)); 

//Booking 4 : wrong timing (invalid)
const booking4: TimeSlot = {
  startTime: new Date("2026-08-04T22:00:00Z"),
  endTime: new Date("2026-08-04T20:00:00Z"),
};
console.log("Booking 4 (22:00 - 20:00, invalid):", engine.addSlot(booking4)); 

 
// Booking 5: 01:00 - 02:00 (Should succeed -> true)
const booking5: TimeSlot = {
  startTime: new Date("2026-08-04T01:00:00Z"),
  endTime: new Date("2026-08-04T02:00:00Z"),
};
console.log("Booking 5 (01:00 - 02:00, Clean):", engine.addSlot(booking5)); 


// Check total slots saved (Should be 2)
console.log("\nTotal Active Bookings:", engine.getSlots().length);