import { z } from "zod";

export const CreateSlotSchema = z.object({
title : z.string().min(1, "Title is required").max(100, "Title is too long"),
startTime: z.string().datetime({message : "Invalid ISO date string for startTime "}),
endTime: z.string().datetime({message : "invalid ISO date string for endTime"})

});

/* That is one of Zod's best features: z.infer automatically extracts 
 the TypeScript type from your schema. You don't have to write duplicate 
 TypeScript interfaces for incoming request bodies anymore—Zod manages both 
runtime validation and static TypeScript types simultaneously.*/
export type CreateSlotInput = z.infer<typeof CreateSlotSchema>;