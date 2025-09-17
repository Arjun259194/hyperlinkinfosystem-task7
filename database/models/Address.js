import mongoose from "mongoose"

const addressSchema = new mongoose.Schema(
  {
    address: String,
    street: String,
    state: String,
    city: String,
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
  }
)

addressSchema.add({
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
})

addressSchema.index({ location: "2dsphere" })

addressSchema.pre("save", function (next) {
  if (this.latitude != null && this.longitude != null) {
    this.location.coordinates = [this.longitude, this.latitude]
  }
  next()
})

const Address = mongoose.model("Address", addressSchema)

export default Address
