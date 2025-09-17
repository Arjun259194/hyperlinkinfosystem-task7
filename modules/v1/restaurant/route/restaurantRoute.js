import { Router } from "express"
import RestaurantController from "../controller/restaurantController.js"

const restaurantRouter = Router()

restaurantRouter.get("/", RestaurantController.get)
restaurantRouter.get("/detailed", RestaurantController.getById)

export default restaurantRouter

// GET    /api/restaurants                    # Browse restaurants
// GET    /api/restaurants/:id                # Restaurant details
// GET    /api/restaurants/:id/menu           # Restaurant menu
// GET    /api/restaurants/search             # Search restaurants
// GET    /api/restaurants/categories         # Restaurant categories
// GET    /api/restaurants/featured           # Featured restaurants
// GET    /api/restaurants/nearby             # Nearby restaurants
