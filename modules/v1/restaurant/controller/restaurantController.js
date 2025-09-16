import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { PaginationValidation } from "../../validation.js"
import { GetRestaurantsAsPerUser } from "../model/restaurantModel.js"

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
}
