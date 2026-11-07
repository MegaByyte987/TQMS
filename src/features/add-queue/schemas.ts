import { z } from "zod";

const BS_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const addQueueFormSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required."),
  fromCheckpointId: z.string().min(1, "Start point is required."),
  toCheckpointId: z.string().min(1, "Destination is required."),
  grossWeight: z
    .number({ error: "Enter a gross weight." })
    .int("Weight must be a whole number.")
    .positive("Weight must be greater than 0.")
    .max(60000, "Weight looks too high. Please verify."),
  entryDateBS: z
    .string()
    .regex(BS_DATE, "Use a BS date in YYYY-MM-DD format."),
  transportCompany: z
    .string()
    .trim()
    .max(100, "Company name is too long.")
    .optional(),
  loadDetails: z
    .string()
    .trim()
    .min(2, "Describe the goods being carried."),
  narration: z
    .string()
    .trim()
    .max(300, "Narration is too long.")
    .optional(),
  driverPhone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine(
      (v) => v === "" || /^9\d{9}$/.test(v),
      "Enter a valid 10-digit mobile number."
    )
    .optional(),
})
  .refine((v) => v.fromCheckpointId !== v.toCheckpointId, {
    message: "Start and destination must be different.",
    path: ["toCheckpointId"],
  });

export type AddQueueFormValues = z.infer<typeof addQueueFormSchema>;