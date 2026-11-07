import { z } from "zod";

export const narrationEditSchema = z.object({
  text: z
    .string()
    .trim()
    .min(2, "Narration must be at least 2 characters.")
    .max(300, "Narration is too long."),
});

export type NarrationEditValues = z.infer<typeof narrationEditSchema>;