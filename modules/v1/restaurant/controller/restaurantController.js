import z from "zod"
import Validate from "../../../../libs/zod.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { PaginationValidation } from "../../validation.js"
import {
  CreateDish,
  GetRestaurantById,
  GetRestaurantByOwnerId,
  GetRestaurantsAsPerUser,
  SearchRestaurant,
  updateDish,
  WriteReview,
} from "../model/restaurantModel.js"
import {
  dishSchema,
  dishUpdateSchema,
  restaurantSearchSchema,
  reviewSCheam,
} from "../validation.js"

/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */
export default class RestaurantController {
  /**
   * @type {ExpressFn}
   */
  static async get(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User id not found", 401)
    const { page, limit } = PaginationValidation(req.query)
    const restaurants = await GetRestaurantsAsPerUser(userId, page, limit)
    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "restaurants found",
      data: restaurants,
    })
  }

  /**
   * @type {ExpressFn}
   */
  static async search(req, res) {
    const param = Validate(restaurantSearchSchema, req.query)
    const restaurants = await SearchRestaurant(param)
    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "restaurants found",
      data: restaurants,
    })
  }

  /** @type {ExpressFn} */
  static async getById(req, res) {
    const restaurant_id = Validate(z.string(), req.body?.restaurant_id)
    const { review_count, sum_of_ratings, ...restaurant } = await GetRestaurantById(restaurant_id)
    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "restaurant found",
      data: { ...restaurant, rating: sum_of_ratings / review_count },
    })
  }

  /**@type {ExpressFn} */
  static async writeReview(req, res) {
    if (!req.userId) throw new ErrorResponse("User Id not found", 401)
    const data = Validate(reviewSCheam, req.body)
    const review = await WriteReview(req.userId, data.restaurant_id, data.content, data.rating)
    res.status(201).locals.sendEncryptedJson({
      code: 201,
      message: "review written",
      review,
    })
  }

  /**@type {ExpressFn} */
  static async addDish(req, res) {
    if (!req.userId) throw new ErrorResponse("User Id not found", 401)
    const addon = Validate(dishSchema, req.body)

    const restaurant = await GetRestaurantByOwnerId(req.userId)
    if (!restaurant) throw new ErrorResponse("No restaurant found", 404)

    const dish = await CreateDish(restaurant._id, addon)

    res.status(201).locals.sendEncryptedJson({
      code: 201,
      message: "Dish added",
      dish,
    })
  }

  /**@type {ExpressFn} */
  static async updateDish(req, res) {
    if (!req.userId) throw new ErrorResponse("User Id not found", 401)
    const { dish_id, ...update } = Validate(dishUpdateSchema, req.body)
    console.log("🚀 ~ RestaurantController ~ updateDish ~ dish_id:", dish_id)

    const updated = await updateDish(req.userId, dish_id, update)

    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "Updated",
      data: updated,
    })
  }
}
