// Define what a booking object looks like
interface Booking {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
}

// Create your in-memory database array
const bookingsArray: Booking[] = [];

// 2. Latency helper
const sleep = (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
};

async function bookSlot(userId: string, startTime: string, endTime: string) {
  // 1. LOG: Announce the check phase
  console.log(`[${userId}] Checking availability...`);

  // 2. CHECK: Search the bookingsArray for any existing booking with the same startTime
  const isBooked = bookingsArray.some((booking) => booking.startTime === startTime);

  // 3. THE GAP: Simulate 100ms network/database delay
  await sleep(100);

  // 4. ACT: Decide based on the result from Step 2
  if (isBooked) {
    console.log(`[${userId}] Slot taken! Booking rejected.`);
    return false;
  }

  // If not booked, push the new booking into the array
  bookingsArray.push({
    id: Math.random().toString(),
    userId,
    startTime,
    endTime,
  });

  console.log(`[${userId}] Booking CONFIRMED!`);
  return true;
}

async function runSimulation(){
    console.log("--- STARTING RACE CONDITION SIMULATION ---\n");
    await Promise.allSettled([ bookSlot("UserA", "10:00", "11:00"),
                            bookSlot("UserB", "10:00", "11:00")]);

    console.log("\n--- SIMULATION COMPLETE ---");
  
  // 2. Inspect the final array state
    console.log("Final Bookings Array:", bookingsArray);

  // 3. Programmatic assertion: Check if double-booking occurred

     if (bookingsArray.length > 1) {
         console.log("double booking of same slot detected ");
     }

     else {
        console.log("\n✅ SUCCESS: Only one booking succeeded.");
     }
    }

    runSimulation();

