import mongoose from "mongoose"

const dishSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  is_veg: { type: Boolean, default: false },
  is_available: { type: Boolean, default: true },
  ingredients: { type: [String], default: [] },
  fruits: { type: [String], default: [] },
  category: { type: String, enum: ["Breakfast", "Lunch", "Dinner"] },
})

const menuSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Types.ObjectId,
      ref: "Restaurant",
      unique: true,
    },
    dishes: [dishSchema],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

const Menu = mongoose.model("Menu", menuSchema)

export default Menu
