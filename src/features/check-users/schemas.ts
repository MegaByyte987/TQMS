import { z } from "zod";

export const checkUserFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),
  stateId: z.string().min(1, "State is required."),
  districtId: z.string().min(1, "District is required."),
  streetAddress: z
    .string()
    .trim()
    .max(200, "Address is too long.")
    .optional(),
  mobileNumber: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine(
      (v) => /^9\d{9}$/.test(v),
      "Enter a valid 10-digit mobile number starting with 9."
    ),
  email: z
    .union([
      z.string().trim().email("Enter a valid email address."),
      z.literal(""),
    ])
    .optional(),
});

export type CheckUserFormValues = z.infer<typeof checkUserFormSchema>;