import Validate from "../../../../libs/zod.js"
import z from "zod"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { CreateOrder, GetOrder, GetUserOrders, UpdateOrdersState } from "../model/orderModel.js"

/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */
export default class OrderController {
	/**@type {ExpressFn} */
	static async createOrder(req, res) {
		if (!req.userId) throw new ErrorResponse("No user id found", 401)
		const order = await CreateOrder(req.userId)
		res.status(200).locals.sendEncryptedJson({
			code: 200,
			message: "Order placed",
			data: order,
		})
	}

	/**@type {ExpressFn} */
	static async GetOrderById(req, res) {
		if (!req.userId) throw new ErrorResponse("No user id found", 401)
		const order_id = Validate(z.string(), req.body?.order_id)
		const order = await GetOrder(order_id)
		res.status(200).locals.sendEncryptedJson({
			code: 200,
			message: "order found",
			data: order,
		})
	}

	/**@type {ExpressFn} */
	static async GetAllMyOrders(req, res) {
		if (!req.userId) throw new ErrorResponse("No user id found", 401)
		const orders = await GetUserOrders(req.userId)
		res.status(200).locals.sendEncryptedJson({
			code: 200,
			message: "orders found",
			data: orders,
		})
	}

	/**@type {ExpressFn} */
	static async UpdateOrderState(req, res) {
		if (!req.userId) throw new ErrorResponse("No user id found", 401)
		const { order_id, order_state, payment_state } = Validate(
			z.object({
				order_id: z.string(),
				order_state: z.enum([
					"pending",
					"confirmed",
					"preparing",
					"ready",
					"out_for_delivery",
					"delivered",
					"cancelled",
				]),
				payment_state: z.enum(["pending", "paid", "failed", "refunded"]),
			}),
			req.body
		)

		const updatedOrder = await UpdateOrdersState(req.userId, order_id, {
			order_state,
			payment_state,
		})

		res.status(200).locals.sendEncryptedJson({
			code: 200,
			message: "Updated",
			data: updatedOrder,
		})
	}
}
