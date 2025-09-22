import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema(
  {
    dish: { type: mongoose.Types.ObjectId, ref: "Dish" },
    quantity: { type: Number, min: 1 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      unique: true,
      ref: "User",
    },
    items: { type: [cartItemSchema] },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

const Cart = mongoose.model("Cart", cartSchema)

export default Cart
