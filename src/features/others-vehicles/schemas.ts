import { z } from "zod";

export const otherVehicleFormSchema = z.object({
  othersTypeId: z.string().min(1, "Others type is required."),
});

export type OtherVehicleFormValues = z.infer<typeof otherVehicleFormSchema>;