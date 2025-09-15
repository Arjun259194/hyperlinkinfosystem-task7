import z from "zod"
import ErrorResponse from "./globalErrorHandler.js"
import { JwtToken } from "../libs/jwt.js"
import Device from "../database/models/Device.js"

/**
 *
 * @param {import('express').Request} req - The Express request object, contains post data in req.body.
 * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
 * @param {import("express").NextFunction} next - The next function for next middleware
 *
 * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
 */
export default async function verifyToken(req, _, next) {
  const header = req.headers["authorization"] || ""
  const rawval =
    header.startsWith("Bearer") ? header.split(" ")[1] : null

  if (!rawval)
    throw new ErrorResponse("Not authorized for this route", 401)

  const parsedcookieval = await z.jwt().safeParseAsync(rawval)

  if (!parsedcookieval.success)
    throw new ErrorResponse("not valid token", 401)

  const token = parsedcookieval.data

  const payload = await JwtToken.payloadFromToken(token)

  if (!payload)
    throw new ErrorResponse(
      "Invalid token: unable to decode or verify",
      401,
    )

  const device = await Device.findOne({
    user_id: payload.id,
    token,
  }).exec()
  if (!device)
    throw new ErrorResponse("Unauthorized device or token", 401)

  req.userId = payload.id
  req.userEmail = payload.email

  next()
}
