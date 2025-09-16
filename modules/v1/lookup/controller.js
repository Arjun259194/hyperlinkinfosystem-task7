import Category from "../../../database/models/Category.js"
import Fruit from "../../../database/models/fruit.js"
import Ingredient from "../../../database/models/Ingredient.js"
import ErrorResponse from "../../../middleware/globalErrorHandler.js"

export const GetFruits = async (req, res) => {
  const data = await Fruit.find()
    .exec()
    .catch(err => {
      console.log("Error while fetching fruits:", err)
      throw new ErrorResponse("failed to fetch fruits from database", 500)
    })

  if (data.lenght <= 0) throw new ErrorResponse("Not found", 404)
  res.status(200).locals.sendEncryptedJson({ code: 200, message: "found", data })
}

export const GetCategories = async (req, res) => {
  const data = await Category.find()
    .exec()
    .catch(err => {
      console.log("Error while fetching categories :", err)
      throw new ErrorResponse("failed to fetch categories from database", 500)
    })

  if (data.lenght <= 0) throw new ErrorResponse("Not found", 404)
  res.status(200).locals.sendEncryptedJson({ code: 200, message: "found", data })
}

export const GetIngredients = async (req, res) => {
  const data = await Ingredient.find()
    .exec()
    .catch(err => {
      console.log("Error while fetching ingredients :", err)
      throw new ErrorResponse("failed to fetch ingredients from database", 500)
    })

  if (data.lenght <= 0) throw new ErrorResponse("Not found", 404)
  res.status(200).locals.sendEncryptedJson({ code: 200, message: "found", data })
}
