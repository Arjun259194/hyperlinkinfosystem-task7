import Cart from "../../../../database/models/Cart.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"

export const GetCart = async userId => {
  let cart = await Cart.findOne({ user: userId }).populate("items.dish").lean()

  if (!cart) throw new ErrorResponse("User cart not found", 404)

  return cart
}

export const AddToCart = async (user_id, dish_id) => {
  const cart = await Cart.findOneAndUpdate(
    { user: user_id },
    {
      $push: {
        items: {
          dish: dish_id,
          quantity: 1,
        },
      },
    },
    {
      new: true,
      upsert: true,
    }
  ).exec()

  return cart.toObject()
}

export const UpdateQuantity = async (userId, cartItemId, quantity) => {
  const updatedCart = await Cart.findOneAndUpdate(
    { user: userId, "items._id": cartItemId },
    { $inc: { "items.$.quantity": quantity } },
    { new: true }
  ).exec()
  if (!updatedCart) throw new ErrorResponse("Cart not found", 404)
  return updatedCart.toObject()
}

export const RemoveCartItem = async (userId, cartItemId) => {
  return await Cart.findOneAndUpdate(
    { user: userId },
    {
      $pull: {
        items: { dish: cartItemId },
      },
    },
    { new: true }
  ).lean()
}
