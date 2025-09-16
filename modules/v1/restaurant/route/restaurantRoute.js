import { Router } from "express"
import RestaurantController from "../controller/restaurantController.js"

const restaurantRouter = Router()

restaurantRouter.get("/", RestaurantController.get)

export default restaurantRouter
