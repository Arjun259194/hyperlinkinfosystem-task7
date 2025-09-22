import { Router } from "express"
import UserController from "../controller/userController.js"

const userRouter = Router()

userRouter.get("/profile", UserController.profile)

export default userRouter
