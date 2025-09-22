import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { getProfile } from "../model/userModel.js"

/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */
export default class UserController {
  /**
   * @type {ExpressFn}
   */
  static async profile(req, res) {
    if (!req.userId) throw new ErrorResponse("User id not found", 401)
    const user = await getProfile(req.userId)
    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "user found",
      data: user,
    })
  }
}
