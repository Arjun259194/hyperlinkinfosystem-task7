import { Router } from "express"
import RestaurantController from "../controller/restaurantController.js"
import AllowRole from "../../../../middleware/role.js"

const restaurantRouter = Router()

restaurantRouter.get("/near", AllowRole("User"), RestaurantController.get)
restaurantRouter.get("/detailed", RestaurantController.getById)
restaurantRouter.post("/review", AllowRole("User"), RestaurantController.writeReview)
restaurantRouter.post("/dish", AllowRole("Chef"), RestaurantController.addDish)
restaurantRouter.put("/dish", AllowRole("Chef"), RestaurantController.updateDish)
restaurantRouter.get("/search", RestaurantController.search)

export default restaurantRouter
