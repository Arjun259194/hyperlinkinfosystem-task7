import mongoose from "mongoose"

const favouriteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "User" },
  restaurant_id: { type: mongoose.Types.ObjectId, ref: "Restaurant" },
})

const Favourite = mongoose.model("Favourite", favouriteSchema)

export default Favourite
