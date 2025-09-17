import Validate from "../../../../libs/zod.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import { getUserAddresses, newAddress } from "../model/addressModel.js"
import { addressSchema } from "../validation.js"

/** @typedef {(req: import("express").Request, res: import("express").Response) => Promise<void>} ExpressFn */
export default class AddressController {
  /**
   * @type {ExpressFn}
   */
  static async get(req, res) {
    if (!req.userId) throw new ErrorResponse("User id not found", 401)
    const addresses = await getUserAddresses(req.userId)
    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "addresses found",
      addresses,
    })
  }

  /**@type {ExpressFn} */
  static async new(req, res) {
    if (!req.userId) throw new ErrorResponse("User Id not found")
    const { make_default, ...address_data } = Validate(addressSchema, req.body)
    const address = await newAddress(req.userId, address_data, make_default)

    res.status(201).locals.sendEncryptedJson({
      code: 200,
      message: "address created",
      address,
    })
  }
}
