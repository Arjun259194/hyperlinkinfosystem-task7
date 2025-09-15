import Device from "../../../../database/models/Device.js"
import PasswordHashing from "../../../../libs/hash.js"
import { JwtToken } from "../../../../libs/jwt.js"
import Validate from "../../../../libs/zod.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { FindUserByEmail, NewChefAndRestaurant, NewUser } from "../model/authModel.js"
import { loginSchema, signupSchema } from "../validation.js"

/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */

export default class AuthController {
  /** @type {ExpressFn} */
  static async signup(req, res) {
    const data = Validate(signupSchema, req.body)
    if (data.role === "User") {
      const { user, address } = data
      user.password = await PasswordHashing.hash(user.password)
      await NewUser(user, address)
    } else if (data.role == "Chef") {
      let { restaurant, restaurant_address, user } = data
      user.password = await PasswordHashing.hash(user.password)
      await NewChefAndRestaurant(user, restaurant, restaurant_address)
    } else {
      throw new ErrorResponse("Other user role not available now", 400)
    }

    res.locals.sendEncryptedJson({
      code: 201,
      message: "User Created",
    })
  }

  /** @type {ExpressFn} */
  static async login(req, res) {
    const data = Validate(loginSchema, req.body)
    const { email, password, device: device_data } = data

    const user = await FindUserByEmail(email)

    const isMatch = await PasswordHashing.compare(password, user.password)

    if (!isMatch) throw new ErrorResponse("Not authorized", 401)

    const token = await JwtToken.new({ id: user._id })

    const device = new Device({ ...device_data, token, user_id: user._id })

    await device.save()

    res.locals.sendEncryptedJson({
      code: 200,
      message: "logged in",
      token,
    })
  }
}
