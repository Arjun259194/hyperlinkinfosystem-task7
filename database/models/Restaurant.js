import mongoose from "mongoose"

const restaurantSchema = new mongoose.Schema(
  {
    owner_id: { type: mongoose.Types.ObjectId, ref: "User" },
    address_id: { type: mongoose.Types.ObjectId, ref: "Address" },
    name: String,
    description: String,
    phone: String,
    email: { type: String, required: true, unique: true },
    cover_image: String,
    logo: String,
    delivery_time: Number,
    delivery_fees: Number,
    is_open: { type: Boolean, default: true },
    opening_time: String,
    closing_time: String,
    review_count: { type: Number, default: 0 },
    sum_of_ratings: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

const Restaurant = mongoose.model("Restaurant", restaurantSchema)

export default Restaurant
