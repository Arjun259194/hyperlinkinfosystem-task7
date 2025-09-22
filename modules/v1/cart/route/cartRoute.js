import { Router } from "express"
import CartController from "../controller/cartController.js"

const cartRouter = Router()

cartRouter.post("/", CartController.add)
cartRouter.get("/", CartController.get)
cartRouter.put("/", CartController.update)
cartRouter.delete("/", CartController.delete)

export default cartRouter
