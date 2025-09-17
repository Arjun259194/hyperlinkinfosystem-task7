import { z } from "zod"
import Validate from "../../libs/zod.js"

// Common user schema fields
export const userBaseSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  role: z.enum(["User", "Chef", "Delivery_Guy"]),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profile_image: z.url().optional().nullable(),
  phone: z.string().min(1, "Phone number is required"),
})

// Address schema used both for user and restaurant
export const addressSchema = z.object({
  address: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pin_code: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  appartment: z.string().optional().nullable(),
  label: z.enum(["Home", "Work", "Other"]).optional().default("Home"),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
})

// Restaurant schema for Chef role signup (excluding address, which is separate)
export const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name required"),
  description: z.string().optional(),
  phone: z.string().min(1, "Restaurant phone required"),
  email: z.email("Invalid restaurant email"),
  cover_image: z.string().url().optional().nullable(),
  logo: z.string().url().optional().nullable(),
  delivery_time: z.number().int().positive().optional(),
  delivery_fees: z.number().nonnegative().optional(),
  address: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pin_code: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  city: z.string().optional().nullable(),
  is_open: z.boolean().optional().default(true),
  opening_time: z.string().optional(),
  closing_time: z.string().optional(),
})

export const PaginationValidation = obj => {
  return Validate(
    z.object({
      page: z.coerce.number().int().min(1).default(1).catch(1),
      limit: z.coerce.number().int().min(1).default(5).catch(5),
    }),
    obj
  )
}
