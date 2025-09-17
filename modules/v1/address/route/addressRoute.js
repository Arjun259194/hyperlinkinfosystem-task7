import { Router } from "express"
import AddressController from "../controller/addressController.js"

const addressRouter = Router()

addressRouter.get("/", AddressController.get)
addressRouter.post("/", AddressController.new)

export default addressRouter
