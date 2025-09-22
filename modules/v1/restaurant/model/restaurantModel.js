import z from "zod"
import Menu, { Dish } from "../../../../database/models/Menu.js"
import Restaurant from "../../../../database/models/Restaurant.js"
import Review from "../../../../database/models/Review.js"
import User from "../../../../database/models/User.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"

export const GetRestaurantByOwnerId = async userId =>
  await Restaurant.findOne({ owner: userId })
    .exec()
    .catch(err => {
      console.error(`Error while getting restaurants: ${err}`)
      throw new ErrorResponse("Failed to fetch restaurants")
    })

/**
 *
 * @param {z.infer<typeof import("../validation.js").restaurantSearchSchema >} params
 */
export const SearchRestaurant = async params => {
  let query = {}

  if (params.name) query.name = { $regex: params.name, $options: "i" }

  if (params.city) query.city = params.city

  if (params.state) query.state = params.state

  if (params.is_open !== undefined) query.is_open = params.is_open

  if (params.delivery_time !== undefined) query.delivery_time = { $lte: params.delivery_time }

  if (params.min_price !== undefined || params.max_price !== undefined) {
    query.delivery_fees = {}
    if (params.min_price !== undefined) query.delivery_fees.$gte = params.min_price
    if (params.max_price !== undefined) query.delivery_fees.$lte = params.max_price
    if (Object.keys(query.delivery_fees).length === 0) delete query.delivery_fees
  }

  if (params.min_rating !== undefined) {
    query.$expr = { $gte: [{ $divide: ["$sum_of_ratings", "$review_count"] }, params.min_rating] }
  }

  return await Restaurant.find(query)
    .lean()
    .catch(err => {
      console.error("Error while searching user: ", err)
      throw new ErrorResponse("Failed to search user in database", 500)
    })
}

export const GetRestaurantsAsPerUser = async (userId, page, limit) => {
  try {
    const user = await User.findOne({ _id: userId }).populate("default_address").exec() // includes address
    if (!user) throw new ErrorResponse("Not User found", 404)

    const userCoordinates = user.default_address.location.coordinates

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
      { $match: { city: user.default_address.city } },
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
    .populate({
      path: "menu",
      populate: "dishes",
    })
    .populate({
      path: "owner",
      select: "-password -otp",
    })
    .exec()
  if (!restaurant) throw new ErrorResponse("Restaurant not found", 404)
  return restaurant.toObject()
}

export const WriteReview = async (userId, rest_id, content, rating) => {
  const review = new Review({
    reviewer: userId,
    restaurant: rest_id,
    content,
    rating,
  })

  await review.validate().catch(err => {
    console.log(err)
    throw new ErrorResponse("Not valid data for review", 400)
  })

  await review.save().catch(err => {
    console.log(err)
    throw new ErrorResponse("Failed to save in database", 500)
  })

  return review.toObject()
}

export const CreateDish = async (
  rest_id,
  { name, price, image, is_veg, is_available, ingredients, fruits, category }
) => {
  const dish = new Dish({
    name,
    price,
    image,
    is_veg,
    is_available,
    ingredients,
    fruits,
    category,
  })

  await dish.save()

  return await Menu.findOneAndUpdate(
    {
      restaurant: rest_id,
    },
    {
      $push: {
        dishes: dish._id,
      },
    },
    { new: true, upsert: true }
  )
    .populate("dishes")
    .exec()
}
