import { z } from "zod";

const PLATE_REGEX = /^[A-Z]{2} \d{1,2} [A-Z]{2,3} \d{3,4}$/;

export const vehicleFormSchema = z.object({
  plateNo: z
    .string()
    .trim()
    .min(1, "Plate number is required.")
    .regex(
      PLATE_REGEX,
      "Use the format 'BA 1 KHA 1234' — two letters, number, letters, number."
    ),
  vehicleNumber: z.string().trim().min(1, "Vehicle number is required."),
  sthaniyaSanghId: z.string().min(1, "Sthaniyasangh is required."),
  ownerId: z.string().min(1, "Vehicle owner is required."),
  vehicleTypeId: z.string().min(1, "Vehicle type is required."),
  plateColorId: z.string().min(1, "Plate color is required."),
  plateTypeId: z.string().min(1, "Plate type is required."),
  lotNo: z.string().trim().max(40).optional(),
  engineNumber: z.string().trim().max(60).optional(),
  chassisNumber: z.string().trim().max(60).optional(),
  companyName: z.string().trim().max(80).optional(),
  modelNo: z.string().trim().max(80).optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;