import z from "zod"

export const reviewSCheam = z.object({
  restaurant_id: z.string(),
  content: z.string(),
  rating: z.float32().min(1).max(5),
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
