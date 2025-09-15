import mongoose from "mongoose"
import Restaurant from "./Restaurant.js"

const reviewSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Restaurant",
    },
    reviewer_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: { type: String, required: false },
    rating: { type: Number, min: 0, max: 5 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
)

reviewSchema.post(
  "save",
  { document: true, query: false },
  async doc => {
    await Restaurant.findOneAndUpdate(
      { _id: doc.restaurant_id },
      {
        $inc: {
          review_count: 1,
          sum_of_ratings: doc.rating || 0,
        },
      },
    ).exec()
  },
)

reviewSchema.post("findOneAndDelete", async doc => {
  if (doc) {
    Restaurant.findOneAndUpdate(
      { _id: doc.restaurant_id },
      {
        $inc: {
          review_count: -1,
          sum_of_ratings: -(doc.rating || 0),
        },
      },
    )
  }
})

const Review = mongoose.model("Review", reviewSchema)

export default Review
