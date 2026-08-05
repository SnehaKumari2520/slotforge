# Day 2 Summary: Time Interval Math & In-Memory Slot Engine

## 1. Pure Time Math Utilities

### Interval Validation (`isValidInterval`)
Ensures that a time slot's start time precedes its end time:
$$\text{startTime} < \text{endTime}$$

### Overlap Detection (`doIntervalsOverlap`)
Two slots (A and B) overlap if and only if:
$$\text{slotA.startTime} < \text{slotB.endTime} \quad \text{AND} \quad \text{slotA.endTime} > \text{slotB.startTime}$$

#### Test Scenarios:
- **Scenario 1 (Overlap):** 10:00–11:00 vs 10:30–11:30 $\rightarrow$ `true`
- **Scenario 2 (Back-to-Back):** 10:00–11:00 vs 11:00–12:00 $\rightarrow$ `false` (valid adjacent slots)
- **Scenario 3 (Invalid Slot):** 11:00–10:00 $\rightarrow$ `false`

---

## 2. In-Memory State Engine (`SlotEngine`)

The `SlotEngine` class manages bookings sequentially:
1. Validates incoming input via `isValidInterval`.
2. Loops through stored slots to verify no collisions using `doIntervalsOverlap`.
3. Pushes valid slots into the internal array `this.slots`.

### Sequential Test Results:
- **Booking 1 (10:00 - 11:00):** `true`
- **Booking 2 (10:30 - 11:30, Overlap):** `false`
- **Booking 3 (11:00 - 12:00, Clean):** `true`
- **Booking 4 (22:00 - 20:00, Invalid):** `false`
- **Booking 5 (01:00 - 02:00, Clean):** `true`

**Total Active Bookings:** `3`