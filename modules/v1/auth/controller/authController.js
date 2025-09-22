import z from "zod"
import Device from "../../../../database/models/Device.js"
import PasswordHashing from "../../../../libs/hash.js"
import { JwtToken } from "../../../../libs/jwt.js"
import Validate from "../../../../libs/zod.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import {
  FindAndDeleteDeviceByUserId,
  FindUserByEmail,
  NewChefAndRestaurant,
  NewUser,
} from "../model/authModel.js"
import { loginSchema, signupSchema } from "../validation.js"
import SMTPGmailService, { EmailTemplate } from "../../../../libs/email.js"
import { env } from "../../../../env.js"

/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */

export default class AuthController {
  /** @type {ExpressFn} */
  static async signup(req, res) {
    let ret
    const data = Validate(signupSchema, req.body)

    if (data.role === "User") {
      const { user, address } = data
      user.password = await PasswordHashing.hash(user.password)
      ret = await NewUser(user, address)
    } else if (data.role === "Chef") {
      console.log("🚀 ~ AuthController ~ signup ~ data:", data)
      console.log("🚀 ~ AuthController ~ signup ~ role:", data.role)
      let { restaurant, restaurant_address, user } = data
      user.password = await PasswordHashing.hash(user.password)
      ret = await NewChefAndRestaurant(user, restaurant, restaurant_address)
    } else {
      throw new ErrorResponse("Other user role not available now", 400)
    }

    res.status(200).locals.sendEncryptedJson({
      code: 201,
      message: "User Created",
      ret,
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

    const device = await Device.findOneAndUpdate(
      { user_id: user._id },
      { token },
      { upsert: true, new: true },
    ).exec()

    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "logged in",
      token,
    })
  }

  /**@type {ExpressFn} */
  static async forgotPassword(req, res) {
    const email = Validate(z.email(), req.body?.email)
    const user = await FindUserByEmail(email)

    const mailer = SMTPGmailService.getInstance()

    user.otp = generate6DigitCode()

    await user.save()

    await mailer.sendMail({
      to: user.email,
      from: env.EMAIL_ADDRESS,
      subject: "Forgot password",
      html: EmailTemplate.ForgotPasswordEmail(user.full_name, user.email, user.otp),
    })

    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "Email sent",
    })
  }

  /**@type {ExpressFn} */
  static async logout(req, res) {
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User id not found", 401)
    await FindAndDeleteDeviceByUserId(userId)

    res.status(200).locals.sendEncryptedJson({
      message: "Logged out",
      code: 200,
    })
  }

  /**@type {ExpressFn} */
  static async otpVerification(req, res) {
    const data = Validate(
      z.object({
        email: z.email(),
        otp: z.string().min(6).max(6),
        newPassword: z.string(),
      }),
      req.body,
    )

    const user = await FindUserByEmail(data.email)

    if (user.otp !== data.otp) {
      throw new ErrorResponse("Wrong OTP", 401)
    }

    user.otp = null
    user.password = await PasswordHashing.hash(data.newPassword)

    await user.save()

    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "Password changed",
    })
  }
}

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
