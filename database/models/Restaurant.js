import mongoose from "mongoose"
import "../models/Review.js"
import "../models/Menu.js"

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Types.ObjectId, ref: "User" },
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
    address: String,
    street: String,
    state: String,
    city: String,
    pin_code: String,
    latitude: Number,
    longitude: Number,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    review_count: { type: Number, default: 0 },
    sum_of_ratings: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

restaurantSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
})

restaurantSchema.virtual("menu", {
  ref: "Menu",
  localField: "_id",
  foreignField: "restaurant",
  justOne: true,
})

restaurantSchema.index({ location: "2dsphere" })

restaurantSchema.pre("save", function (next) {
  if (this.latitude != null && this.longitude != null) {
    this.location.coordinates = [this.longitude, this.latitude]
  }
  next()
})

restaurantSchema.set("toObject", { virtuals: true })

const Restaurant = mongoose.model("Restaurant", restaurantSchema)

export default Restaurant
