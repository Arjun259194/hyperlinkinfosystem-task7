import Restaurant from "../../../../database/models/Restaurant.js"
import User from "../../../../database/models/User.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"

/*
address: {
    _id: new ObjectId('68c8f94cb3c081522cbea62d'),
    address: '123 Maple Street',
    street: 'Maple Street',
    state: 'California',
    pin_code: '90210',
    appartment: 'Apt 4B',
    label: 'Home',
    latitude: 23.04132,
    longitude: 72.528036,
    created_at: 2025-09-16T05:44:44.906Z,
    updated_at: 2025-09-16T05:44:44.906Z,
    __v: 0
  },
  */

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

function calDis(lat1, lon1, lat2, lon2, R = 6371) {
  return (
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((Radian(lat2) - Radian(lat1)) / 2), 2) +
          Math.cos(Radian(lat1)) *
            Math.cos(Radian(lat2)) *
            Math.pow(Math.sin((Radian(lon2) - Radian(lon1)) / 2), 2)
      )
    )
  )
}
const Radian = degrees => (degrees * Math.PI) / 180
