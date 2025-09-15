import bcrypt from "bcrypt"
import { env } from "../env.js"

export default class PasswordHashing {
  static saltRounds = env.SALT

  static async hash(data) {
    const salt = await bcrypt.genSalt(PasswordHashing.saltRounds)
    return await bcrypt.hash(data, salt)
  }

  static async compare(data, hashedData) {
    return await bcrypt.compare(data, hashedData)
  }
}
