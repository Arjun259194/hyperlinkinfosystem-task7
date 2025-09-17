import { Router } from "express"
import RestaurantController from "../controller/restaurantController.js"
import AllowRole from "../../../../middleware/role.js"

const restaurantRouter = Router()

restaurantRouter.get("/near", AllowRole("User"), RestaurantController.get)
restaurantRouter.get("/detailed", RestaurantController.getById)
restaurantRouter.post("/review", AllowRole("User"), RestaurantController.writeReview)
restaurantRouter.post("/dish", AllowRole("Chef"), RestaurantController.addDish)

export default restaurantRouter

// GET    /api/restaurants                    # Browse restaurants
// GET    /api/restaurants/:id                # Restaurant details
// GET    /api/restaurants/:id/menu           # Restaurant menu
// GET    /api/restaurants/search             # Search restaurants
// GET    /api/restaurants/categories         # Restaurant categories
// GET    /api/restaurants/featured           # Featured restaurants
// GET    /api/restaurants/nearby             # Nearby restaurants
