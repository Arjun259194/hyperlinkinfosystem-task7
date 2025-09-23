import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
  dish_id: {
    type: mongoose.Types.ObjectId,
    ref: "Dish",
    required: true,
  },
  name: { type: String, required: true }, // Store name for snapshot
  quantity: { type: Number, required: true, min: 1 },
  delivery_fee: Number,
  total_price: { type: Number, required: true },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    delivery_address_id: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    order_items: [orderItemSchema],

    subtotal: { type: Number, required: true },
    delivery_fee: { type: Number, default: 0 },
    total_amount: { type: Number, required: true },

    payment_method: {
      type: String,
      enum: ["cash", "card", "upi", "wallet"],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    order_status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

const Order = mongoose.model("Order", orderSchema)
export default Order
