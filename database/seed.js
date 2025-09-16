// seed.js - Seeder file to populate the collections
import mongoose from "mongoose"
import Category from "./models/Category.js"
import Ingredient from "./models/Ingredient.js"
import Fruit from "./models/fruit.js"
import { env } from "../env.js"

const categories = [
  { name: "Pizza" },
  { name: "Burger" },
  { name: "Sandwiches" },
  { name: "Pasta" },
  { name: "Salads" },
  { name: "Drinks" },
  { name: "Desserts" },
  { name: "Snacks" },
]

const ingredients = [{ name: "Salt" }, { name: "Sugar" }, { name: "Butter" }, { name: "Flour" }]

const fruits = [{ name: "Apple" }, { name: "Banana" }, { name: "Orange" }, { name: "Mango" }]

async function seedDB() {
  try {
    await mongoose.connect(env.DATABASE_URI)
    console.log("Connected to MongoDB")

    await Category.deleteMany({})
    await Ingredient.deleteMany({})
    await Fruit.deleteMany({})

    await Category.insertMany(categories)
    await Ingredient.insertMany(ingredients)
    await Fruit.insertMany(fruits)

    console.log("Seeding complete")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding DB:", error)
    process.exit(1)
  }
}

seedDB()
