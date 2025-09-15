import mongoose from "mongoose"

const menuSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Types.ObjectId,
      ref: "Restaurant",
    },
    dishes: { type: [mongoose.Types.ObjectId], ref: "Dish" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

const Menu = mongoose.model("Menu", menuSchema)

export default Menu
