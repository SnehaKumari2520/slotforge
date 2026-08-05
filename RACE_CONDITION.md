# SlotForge — Proof of Concept: Race Condition Simulation

## Executive Summary
In single-threaded Node.js applications, asynchronous I/O operations (database reads/writes, network calls) introduce execution delays. This script proves that without atomic locking or database transactions, concurrent requests can execute non-atomic "check-then-act" logic, leading to double bookings.

---

## Terminal Output (Actual Run)

--- STARTING RACE CONDITION SIMULATION ---

[UserA] Checking availability...
[UserB] Checking availability...
[UserA] Booking CONFIRMED!
[UserB] Booking CONFIRMED!

--- SIMULATION COMPLETE ---
Final Bookings Array: [
  {
    id: '0.008563929658858216',
    userId: 'UserA',
    startTime: '10:00',
    endTime: '11:00'
  },
  {
    id: '0.9131550178525454',
    userId: 'UserB',
    startTime: '10:00',
    endTime: '11:00'
  }
]
double booking of same slot detected 

THE PROBLEM IS USER A AND USER B HAS BOOKED THE SAME SLOT BECAUSE WHEN USER A HIT SLEEP(100) WAS PAUSED USER B SAW (isBooked = false) and it also started executing... 

User A enters  ──► Checks array (Empty) ──► Hits sleep(100) [PAUSED]
User B enters  ──► Checks array (STILL Empty!) ──► Hits sleep(100) [PAUSED]
User A wakes   ──► Writes booking ──► Confirmed!
User B wakes   ──► Writes booking ──► Confirmed! (DOUBLE BOOKING)

