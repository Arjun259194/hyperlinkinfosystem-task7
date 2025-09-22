import z from "zod"
import Validate from "../../../../libs/zod.js"
import { AddToCart, GetCart, RemoveCartItem, UpdateQuantity } from "../model/cartModel.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"

/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */

export default class CartController {
  /**@type {ExpressFn} */
  static async get(req, res) {
    if (!req.userId) throw new ErrorResponse("User Id not found")
    const cart = await GetCart(req.userId)
    console.log("🚀 ~ CartController ~ get ~ cart:", cart)
    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "Cart found",
      data: { ...cart },
    })
  }

  /**@type {ExpressFn} */
  static async add(req, res) {
    if (!req.userId) throw new ErrorResponse("User Id not found")
    const { dish_id } = Validate(
      z.object({
        dish_id: z.string(),
      }),
      req.body,
    )
    const item = await AddToCart(req.userId, dish_id)
    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "Added to cart",
      data: item,
    })
  }

  /**@type {ExpressFn} */
  static async update(req, res) {
    if (!req.userId) throw new ErrorResponse("User Id not found")
    const cartItemUpdate = Validate(
      z.object({
        id: z.string(),
        quntitry: z.coerce.number().int(),
      }),
      req.body,
    )
    const updatedCart = await UpdateQuantity(req.userId, cartItemUpdate.id, cartItemUpdate.quntitry)

    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "Updated",
      data: updatedCart,
    })
  }

  /**@type {ExpressFn} */
  static async delete(req, res) {
    if (!req.userId) throw new ErrorResponse("User Id not found")
    const cartItemId = Validate(z.string(), req.body?.cart_item_id)
    const item = await RemoveCartItem(req.userId, cartItemId)
    if (!item) throw new ErrorResponse("item not found on cart", 404)
    res.sendStatus(204)
  }
}
