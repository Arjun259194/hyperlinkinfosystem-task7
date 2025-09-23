import { Router } from "express"
import OrderController from "../controller/orderController.js"

const orderRouter = Router()

orderRouter.post("/", OrderController.createOrder)
orderRouter.get("/", OrderController.GetOrderById)
orderRouter.get("/my", OrderController.GetAllMyOrders)
orderRouter.put("/", OrderController.UpdateOrderState)

export default orderRouter
