import mongoose from "mongoose"

const dishSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    is_veg: { type: Boolean, default: false },
    is_available: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

const Dish = mongoose.model("Dish", dishSchema)
