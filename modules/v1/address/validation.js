import z from "zod"

export const addressSchema = z.object({
  address: z.string().optional(),
  street: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pin_code: z.string().optional(),
  appartment: z.string().optional(),
  label: z.enum(["Home", "Work", "Other"]).optional().default("Home"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  make_default: z.boolean().optional(),
})

export const addressUpdateSChmea = addressSchema
  .omit({ make_default: true, label: true })
  .extend({
    label: z.enum(["Home", "Work", "Other"]),
  })
  .partial()
  .extend({
    address_id: z.string(),
  })
