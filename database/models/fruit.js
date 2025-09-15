// Fruit.js
import mongoose from "mongoose"

const fruitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
)

const Fruit = mongoose.model("Fruit", fruitSchema)
export default Fruit
