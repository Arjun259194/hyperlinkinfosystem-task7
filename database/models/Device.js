import { Schema, Types } from "mongoose"

const deviceSchema = new Schema(
  {
    user_id: { type: Types.ObjectId, required: true },
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
  },
)

const Device = model("Device", deviceSchema)

export default Device
