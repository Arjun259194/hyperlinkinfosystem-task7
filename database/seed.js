// seed.js - Seeder file to populate the collections
import mongoose from "mongoose"
import Category from "./models/Category.js"
import Ingredient from "./models/Ingredient.js"
import Fruit from "./models/fruit.js"
import { env } from "../env.js"
import { faker } from "@faker-js/faker"
import Address from "./models/Address.js"
import User from "./models/User.js"
import Restaurant from "./models/Restaurant.js"
import PasswordHashing from "../libs/hash.js"
import Device from "./models/Device.js"

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

async function seedChef() {
  for (let i = 0; i <= 20; i++) {
    const chef = {
      full_name: faker.person.fullName(),
      role: "Chef",
      email: faker.internet.email(),
      password: await PasswordHashing.hash(faker.internet.password()),
      profile_image: faker.image.avatar(),
      phone: faker.phone.number(),
    }

    const restaurant_data = {
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      cover_image: faker.image.url(),
      logo: faker.image.avatar(),
      delivery_time: faker.number.int({ min: 8, max: 45 }),
      delivery_fees: faker.number.int({ min: 15, max: 100 }),
      is_open: faker.datatype.boolean({ probability: 0.75 }),
      opening_time: "11:00 AM",
      closing_time: "09:00 PM",
      address: faker.location.streetAddress(),
      street: faker.location.street(),
      state: faker.location.state(),
      city: faker.datatype.boolean({ probability: 0.3 }) ? faker.location.city() : "Ahmedabad",
      pin_code: faker.location.zipCode(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    }

    const user = new User(chef)

    await user.validate()
    await user.save()

    const restaurant = new Restaurant(restaurant_data)

    restaurant.owner_id = user._id

    await restaurant.validate()
    await restaurant.save()
  }
}

async function seedDB() {
  try {
    await mongoose.connect(env.DATABASE_URI)
    console.log("Connected to MongoDB")

    await Promise.all([
      Category.deleteMany({}),
      Ingredient.deleteMany({}),
      Fruit.deleteMany({}),
      Restaurant.deleteMany({}),
      Address.deleteMany({}),
      User.deleteMany({}),
      Device.deleteMany({}),
    ])

    console.log(`\nRemoved
    \t [-] categories
    \t [-] ingredients
    \t [-] fruits
    \t [-] devices
    \t [-] 20 restaurants
    \t [-] 20 addresses (of restaurants)
    \t [-] 20 chefs`)

    await Promise.all([
      Category.insertMany(categories),
      Ingredient.insertMany(ingredients),
      Fruit.insertMany(fruits),
      seedChef(),
    ])

    console.log(`\nseeded
    \t [o] categories
    \t [o] ingredients
    \t [o] fruits
    \t [o] 20 restaurants
    \t [o] 20 addresses (of restaurants)
    \t [o] 20 chefs`)

    console.log("Seeding complete")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding DB:", error)
    process.exit(1)
  }
}

seedDB()
