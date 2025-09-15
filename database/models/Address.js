import mongoose from "mongoose"

const addressSchema = new mongoose.Schema(
  {
    address: String,
    street: String,
    state: String,
    pin_code: String,
    appartment: String,
    label: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },
    latitude: Number,
    longitude: Number,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

const Address = mongoose.model("Address", addressSchema)

export default Address
