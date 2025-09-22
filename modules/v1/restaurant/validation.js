import z from "zod"

export const reviewSCheam = z.object({
  restaurant_id: z.string(),
  content: z.string(),
  rating: z.float32().min(1).max(5),
})

export const restaurantSearchSchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  is_open: z.coerce.boolean().optional(),
  delivery_time: z.coerce.number().int().min(1).optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  min_rating: z.coerce.number().min(0).max(5).optional(),
})

export const dishSchema = z.object({
  name: z.string(),
  price: z.float32(),
  image: z.url(),
  is_veg: z.boolean(),
  is_available: z.boolean(),
  ingredients: z.array(z.string()),
  fruits: z.array(z.string()),
  category: z.string(),
})

export const dishUpdateSchema = dishSchema.partial().extend({
  dish_id: z.string(),
})
