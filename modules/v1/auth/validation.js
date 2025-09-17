import z from "zod"
import { addressSchema, restaurantSchema, userBaseSchema } from "../validation.js"

export const signupSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("User"),
    user: userBaseSchema.extend({ role: z.literal("User") }),
    address: addressSchema,
  }),

  z.object({
    role: z.literal("Chef"),
    user: userBaseSchema.extend({ role: z.literal("Chef") }),
    restaurant: restaurantSchema,
  }),

  z.object({
    role: z.literal("Delivery_Guy"),
    user: userBaseSchema.extend({ role: z.literal("Delivery_Guy") }),
  }),
])

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  device: z.object({
    device_type: z.string().optional(),
    device_name: z.string().optional(),
    os_version: z.string().optional(),
    model_name: z.string().optional(),
    ip: z.string().optional(),
    app_version: z.string().optional(),
    platform: z.string().optional(),
  }),
})
