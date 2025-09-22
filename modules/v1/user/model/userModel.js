import User from "../../../../database/models/User.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"

export const getProfile = async id => {
  const user = await User.findOne({ _id: id })
    .select("-password -otp -__v")
    .populate("default_address")
    .populate("addresses")
    .populate({
      path: "device",
      select: "-token -user_id -__v",
    })
    .exec()
    .catch(err => {
      console.error("Error while fetching user: ", err)
      throw new ErrorResponse("Failed to get user from database", 500)
    })

  if (!user) throw new ErrorResponse("User not found", 404)

  return user.toObject()
}
