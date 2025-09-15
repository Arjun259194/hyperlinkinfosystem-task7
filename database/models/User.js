import { model, Schema, Types } from "mongoose"

const userSchema = new Schema(
  {
    full_name: { type: String, required: true },
    role: {
      type: String,
      enum: ["User", "Chef", "Delivery_Guy"],
      default: "User",
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_image: { type: String },
    phone: { type: String, required: true, unique: true },
    default_address_id: { type: Types.ObjectId, ref: "Address" },
    addresses: { type: [Types.ObjectId], ref: "Address", default: [] },
    device_id: { type: Types.ObjectId, ref: "Device", default: null},
    otp: { type: String, default: null, unique: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

userSchema.index({ email: "text" })

const User = model("User", userSchema)

export default User
