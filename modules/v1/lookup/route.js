import { Router } from "express"
import { GetCategories, GetFruits, GetIngredients } from "./controller.js"

const lookupRouter = Router()

lookupRouter.get("/categories", GetCategories)
lookupRouter.get("/ingredients", GetIngredients)
lookupRouter.get("/fruits", GetFruits)

export default lookupRouter
