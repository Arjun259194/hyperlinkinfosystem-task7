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
import Menu from "./models/Menu.js"
import Review from "./models/Review.js"

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

async function seedChefAndRestaurants() {
  let restaurants_ids = []
  for (let i = 0; i <= 20; i++) {
    const chef_data = {
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

    const dishs = Array(8)
      .fill({})
      .map(() => {
        return {
          name: faker.food.dish(),
          price: faker.commerce.price({ min: 50, max: 450 }),
          image: faker.image.url(),
          is_veg: faker.datatype.boolean({ probability: 0.5 }),
          is_available: faker.datatype.boolean({ probability: 0.7 }),
          ingredients: faker.helpers.arrayElements(
            ingredients.map(i => i.name),
            { min: 3, max: 6 }
          ),
          fruits: faker.helpers.arrayElements(
            fruits.map(f => f.name),
            { min: 3, max: 6 }
          ),
        }
      })

    const chef = new User(chef_data)

    await chef.validate()
    await chef.save()

    const restaurant = new Restaurant(restaurant_data)

    restaurant.owner = chef._id

    await restaurant.validate()
    await restaurant.save()

    const menu = new Menu({
      restaurant: restaurant._id,
      dishes: dishs,
    })

    await menu.validate()
    await menu.save()
    restaurants_ids.push(restaurant._id)
  }

  return restaurants_ids
}

async function seedUserAndReviews(rest_ids) {
  for (let i = 0; i < 15; i++) {
    let user_data = {
      user: {
        full_name: faker.person.fullName(),
        role: "User",
        email: faker.internet.email(),
        password: faker.internet.password(),
        profile_image: faker.image.avatar(),
        phone: faker.phone.number(),
      },
      address: {
        address: faker.location.streetAddress(),
        street: faker.location.street(),
        state: faker.location.state(),
        city: faker.datatype.boolean({ probability: 0.3 }) ? faker.location.city() : "Ahmedabad",
        pin_code: faker.location.zipCode(),
        appartment: "Apt 4B",
        label: faker.helpers.arrayElement(["Home", "Work", "Other"]),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
    }

    const user = new User(user_data.user)

    await user.validate()
    await user.save()

    const reviews = Array(12)
      .fill({})
      .map(() => {
        return {
          content: faker.lorem.sentences(),
          rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
          reviewer: user._id,
          restaurant: faker.helpers.arrayElement(rest_ids),
        }
      })

    Promise.all(
      reviews.map(async r => {
        const newr = new Review(r)
        await newr.validate()
        await newr.save()
      })
    )
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
      Menu.deleteMany({}),
      Review.deleteMany({}),
    ])

    console.log(`\nRemoved
    \t [-] categories
    \t [-] ingredients
    \t [-] fruits
    \t [-] devices
    \t [-] 20 restaurants
    \t [-] 20 addresses (of restaurants)
    \t [-] 15 * 12 reviews (of restaurants)
    \t [-] 20 chefs`)

    await Promise.all([
      Category.insertMany(categories),
      Ingredient.insertMany(ingredients),
      Fruit.insertMany(fruits),
    ])

    const rest_ids = await seedChefAndRestaurants()
    await seedUserAndReviews(rest_ids)

    console.log(`\nseeded
    \t [o] categories
    \t [o] ingredients
    \t [o] fruits
    \t [o] 20 restaurants
    \t [o] 8*20 Menu
    \t [o] 20 chefs
    \t [o] 7 users
    \t [o] 15 * 12 reviews`)

    console.log("Seeding complete")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding DB:", error)
    process.exit(1)
  }
}

seedDB()
