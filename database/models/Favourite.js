import mongoose from "mongoose"

const favouriteSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  restaurant: { type: mongoose.Types.ObjectId, ref: "Restaurant" },
})

const Favourite = mongoose.model("Favourite", favouriteSchema)

export default Favourite
