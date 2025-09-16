import { Router } from "express"
import AuthController from "../controller/authController.js"
import verifyToken from "../../../../middleware/jwt.js"

const authRouter = Router()

authRouter.post("/signup", AuthController.signup)
authRouter.post("/login", AuthController.login)
authRouter.post("/logout", verifyToken, AuthController.logout)
authRouter.post("/forgot-password", AuthController.forgotPassword)
authRouter.post("/verify", AuthController.otpVerification)

export default authRouter
