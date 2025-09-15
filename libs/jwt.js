import jwt from "jsonwebtoken"
import { env } from "../env.js"

export class JwtToken {
  /**
   *
   * @param {{id: string}} payload
   * @returns {Promise<string>}
   */
  static async new(payload) {
    return await jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "1d",
    })
  }

  /**
   *
   * @param {string} token
   * @returns {Promise<{id: string, email: string} | null>}
   */
  static async payloadFromToken(token) {
    const isValid = jwt.verify(token, env.JWT_SECRET)
    if (!isValid) return null
    const payload = jwt.decode(token)
    return payload
  }
}
