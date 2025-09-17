import mongoose from "mongoose"

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      unique: true,
      ref: "User",
    },
    items: { type: [mongoose.Types.ObjectId], ref: "CartItem" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

const Cart = mongoose.model("Cart", cartSchema)

const cartItemSchema = new mongoose.Schema(
  {
    cart_id: { type: mongoose.Types.ObjectId, ref: "Cart" },
    dish_id: { type: mongoose.Types.ObjectId, ref: "Dish" },
    quantity: { type: Number, min: 1 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

export const CartItem = mongoose.model("CartItem", cartItemSchema)

export default Cart
