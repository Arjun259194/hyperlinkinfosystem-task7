import Restaurant from "../../../../database/models/Restaurant.js"
import User from "../../../../database/models/User.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"

export const GetRestaurantsAsPerUser = async (userId, page, limit) => {
  try {
    const user = await User.findOne({ _id: userId }).populate("address").exec() // includes address
    if (!user) throw new ErrorResponse("Not User found", 404)
    const userCoordinates = user.address.location.coordinates

    const restaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: userCoordinates,
          },
          distanceField: "distance",
          spherical: true,
          key: "location",
        },
      },
      { $match: { city: user.address.city } },
      { $sort: { distance: 1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ])

    return restaurants
  } catch (error) {
    console.error(`Error while getting restaurants for user: ${error}`)
    throw new ErrorResponse("Failed to fetch restaurants")
  }
}

export const GetRestaurantById = async id => {
  const restaurant = await Restaurant.findOne({ _id: id })
    .populate("reviews")
    .populate("menu")
    .populate({
      path: "owner",
      select: "-password -otp",
    })
    .exec()
  if (!restaurant) throw new ErrorResponse("Restaurant not found", 404)
  return restaurant.toObject()
}
