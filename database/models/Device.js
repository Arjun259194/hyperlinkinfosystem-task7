import mongoose from "mongoose"

const deviceSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, required: true, unique: true },
    token: { type: String, default: null },
    device_type: String,
    device_name: String,
    os_version: String,
    model_name: String,
    ip: String,
    app_version: String,
    platform: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
)

const Device = mongoose.model("Device", deviceSchema)

export default Device
