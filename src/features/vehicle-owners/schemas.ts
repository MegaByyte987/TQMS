import { z } from "zod";

const PAN_REGEX = /^\d{9}$/;

export const vehicleOwnerFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(120, "Name is too long."),
    stateId: z.string().min(1, "State is required."),
    districtId: z.string().min(1, "District is required."),
    localLevel: z.string().trim().max(80).optional(),
    streetAddress: z.string().trim().max(200).optional(),
    email: z
      .union([z.string().trim().email("Enter a valid email."), z.literal("")])
      .optional(),
    panNumber: z
      .union([
        z.string().trim().regex(PAN_REGEX, "PAN must be 9 digits."),
        z.literal(""),
      ])
      .optional(),
    phoneNumber: z
      .string()
      .trim()
      .transform((v) => v.replace(/\D/g, ""))
      .refine(
        (v) => /^0\d{8,9}$/.test(v) || /^9\d{9}$/.test(v),
        "Enter a valid phone number."
      ),
    isIndividual: z.boolean(),
    contactName: z.string().trim().max(80).optional(),
    contactEmail: z
      .union([z.string().trim().email("Enter a valid email."), z.literal("")])
      .optional(),
    contactPhone: z
      .string()
      .trim()
      .transform((v) => v.replace(/\D/g, ""))
      .refine(
        (v) => v === "" || /^9\d{9}$/.test(v) || /^0\d{8,9}$/.test(v),
        "Enter a valid phone number."
      )
      .optional(),
    registrationNumber: z.string().trim().max(40).optional(),
    // File fields: captured in the UI, not persisted by the mock backend.
    // `z.unknown()` accepts a File on the client and the empty object that
    // JSON-serialisation produces on the server side, so the same schema
    // validates both call sites.
    logo: z.unknown().optional(),
    registrationDocument: z.unknown().optional(),
  })
  .refine(
    (v) =>
      v.isIndividual ||
      (v.contactName && v.contactName.length > 0 &&
        v.contactPhone && v.contactPhone.length > 0),
    {
      message: "Contact details are required for company owners.",
      path: ["contactName"],
    }
  );

export type VehicleOwnerFormValues = z.infer<typeof vehicleOwnerFormSchema>;