import Cart from "../../../../database/models/Cart.js"
import Order from "../../../../database/models/Order.js"
import User from "../../../../database/models/User.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"

export const CreateOrder = async (userId, payment_method) => {
	const cart = await Cart.findOne({ user: userId })
		.populate({
			path: "items.dish",
			populate: {
				path: "restaurant",
			},
		})
		.exec()

	if (!cart || cart.items.length <= 0)
		throw new ErrorResponse("No or empty cart, try adding items", 400)

	const user = await User.findOne({ _id: userId }).lean()
	if (!user) throw new ErrorResponse("No User found", 404)

	const df = cart.items.reduce((prev, curr) => prev + curr.dish.restaurant.delivery_fees, 0)
	const st = cart.items.reduce((prev, curr) => prev + curr.dish.price * curr.quantity, 0)

	const order = new Order({
		user: userId,
		subtotal: st,
		delivery_address_id: user.default_address,
		delivery_fee: df,
		total_amount: df + st,
		order_items: cart.items.map(({ dish, quantity }) => {
			return {
				dish_id: dish._id,
				name: dish.name,
				quantity,
				delivery_fee: dish.restaurant.delivery_fees,
				total_price: dish.price * quantity,
			}
		}),
		payment_method: payment_method || "upi",
	})

	await order.validate().catch(err => {
		console.error("Error while validating order:", err)
		throw new ErrorResponse("Failed to validate order", 400)
	})

	await order.save().catch(err => {
		console.error("Error while saving order to database:", err)
		throw new ErrorResponse("Failed to save order to database", 500)
	})

	await Cart.findOneAndDelete({ _id: cart._id }).exec()

	return order.toObject()
}

export const GetOrder = async id => {
	const order = await Order.findOne({ _id: id })
		.exec()
		.catch(err => {
			console.error("Error while getting order:", err)
			throw new ErrorResponse("Failed to get order", 500)
		})
	if (!order) throw new ErrorResponse("Order not found", 404)
	return order.toObject()
}

export const GetUserOrders = async userId => {
	const orders = await Order.find({ user: userId })
		.exec()
		.catch(err => {
			console.error("Error while getting orders:", err)
			throw new ErrorResponse("Failed to get orders", 500)
		})
	if (!orders || orders.length <= 0) throw new ErrorResponse("ORder not found", 404)
	return orders
}

export const UpdateOrdersState = async (userId, orderId, { order_state, payment_state }) => {
	let updatequery = {}
	if (order_state) updatequery.order_status = order_state
	if (payment_state) updatequery.payment_status = payment_state
	if (Object.keys(updatequery).length <= 0) return

	const update = await Order.findOneAndUpdate({ _id: orderId, user: userId }, updatequery, {
		new: true,
	})
		.exec()
		.catch(err => {
			console.log("Error while updating order in database:", err)
			throw new ErrorResponse("Failed to update order", 500)
		})
	if (!update) throw new ErrorResponse("Order not found", 404)
	return update.toObject()
}
