import express from "express"
import cors from "cors"
import authRouter from "./modules/v1/auth/route/authRouter.js"
import decryptRequest from "./middleware/dec.js"
import Encryption from "./libs/enc.js"
import { globalErrorHandler } from "./middleware/globalErrorHandler.js"
import { env } from "./env.js"
import connectDB from "./database/index.js"
import swaggerUi from "swagger-ui-express"
import fs from "fs"
import verifyToken from "./middleware/jwt.js"
import restaurantRouter from "./modules/v1/restaurant/route/restaurantRoute.js"
import addressRouter from "./modules/v1/address/route/addressRoute.js"
import cartRouter from "./modules/v1/cart/route/cartRoute.js"

const IS_DEV_ENV = process.env.NODE_ENV !== "production"

console.clear() // for better look at the server logs

await connectDB(env.DATABASE_URI)

const app = express()

app.use(cors())
app.use(express.text({ type: "text/*" }))
app.use(express.urlencoded({ extended: true }))

const v1 = express.Router()

v1.use((_, res, next) => {
  res.locals.sendEncryptedJson = obj => {
    const encres = Encryption.encrypt(JSON.stringify(obj))
    res.send(encres)
  }
  next()
})

v1.use("/auth", decryptRequest, authRouter)
v1.use("/restaurant", decryptRequest, verifyToken, restaurantRouter)
v1.use("/address", decryptRequest, verifyToken, addressRouter)
v1.use("/cart", decryptRequest, verifyToken, cartRouter)

app.use("/api/v1", v1)

app.use(globalErrorHandler)

const swaggerDocument = JSON.parse(fs.readFileSync("./document/v1/swagger.json", "utf-8"))

app.use("/api-doc/v1/", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

if (IS_DEV_ENV) {
  app.get("/dec", (req, res) => {
    const text = req.body
    const json = Encryption.decrypt(text)
    res.status(200).json(JSON.parse(json))
  })

  app.get("/enc", (req, res) => {
    const text = req.body
    const enctext = Encryption.encrypt(text)
    res.status(200).send(enctext)
  })
}

app.listen(env.PORT, () => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `
    🚀 ===========================================
       Server is blasting off on port: ${env.PORT}
       Ready to handle requests! 🎯
       ===========================================
#Logs`,
  )
})
