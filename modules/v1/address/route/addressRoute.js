import { Router } from "express"
import AddressController from "../controller/addressController.js"

const addressRouter = Router()

addressRouter.get("/", AddressController.get)
addressRouter.post("/", AddressController.new)
addressRouter.delete("/", AddressController.delete)
addressRouter.put("/", AddressController.update)
addressRouter.put("/change-default", AddressController.setDefault)

export default addressRouter
