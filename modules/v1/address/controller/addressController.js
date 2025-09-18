import Validate from "../../../../libs/zod.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"
import {
  changeDefaultAddress,
  deleteAddress,
  getUserAddresses,
  newAddress,
  updateAddress,
} from "../model/addressModel.js"
import { addressSchema, addressUpdateSChmea } from "../validation.js"
import z from "zod"

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
    if (!req.userId) throw new ErrorResponse("User Id not found", 401)
    const { make_default, ...address_data } = Validate(addressSchema, req.body)
    const address = await newAddress(req.userId, address_data, make_default)

    res.status(201).locals.sendEncryptedJson({
      code: 200,
      message: "address created",
      address,
    })
  }

  /**@type {ExpressFn} */
  static async delete(req, res) {
    if (!req.userId) throw new ErrorResponse("User id not found", 401)
    const address_id = Validate(z.string(), req.body?.address_id)
    await deleteAddress(req.userId, address_id)
    res.sendStatus(204)
  }

  /**@type {ExpressFn} */
  static async update(req, res) {
    if (!req.userId) throw new ErrorResponse("User id not found", 401)

    const { address_id, ...rest } = Validate(addressUpdateSChmea, req.body)
    const x = await updateAddress(address_id, rest)
    if (!x) throw new ErrorResponse("Address not found", 404)

    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "Updated",
    })
  }

  /**@type {ExpressFn} */
  static async setDefault(req, res) {
    if (!req.userId) throw new ErrorResponse("User id not found", 401)
    const address_id = Validate(z.string(), req.body?.address_id)
    await changeDefaultAddress(req.userId, address_id)
    res.status(200).locals.sendEncryptedJson({
      code: 200,
      message: "default address changed",
    })
  }
}
