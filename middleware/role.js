import z from "zod"
import ErrorResponse from "./globalErrorHandler.js"
import User from "../database/models/User.js"

/**
 *
 * This middleware checks for valid user role
 * If using this middleware, make sure it comes after the token verification middleware in middleware order
 * @param {"Visitor"  | "Reporter"} role
 */

export default function AllowRole(role) {
  const isValidRole = z.enum(["User", "Chef"]).safeParse(role)
  if (!isValidRole.success) {
    console.log("Wrong role passed in AllowRole middleware.")
    console.log(`Role ${role} is not allowed in this application for user`)
    process.exit(1)
  }

  /**
   *
   * @param {import('express').Request} req - The Express request object, contains post data in req.body.
   * @param {import('express').Response} res - The Express response object, used to send back the created post or errors.
   * @param {import("express").NextFunction} next - The next function for next middleware
   *
   * @returns {Promise<void>} - Sends JSON response with the created post or an error status.
   */
  return async function (req, res, next) {
    console.log("Getting called on ", req.url)
    const userId = req.userId
    if (!userId) throw new ErrorResponse("User id not found", 401)

    const isMatchUserRole = await User.exists({
      _id: userId,
      role,
    })

    if (!isMatchUserRole) throw new ErrorResponse("You don't have access to this route", 403)

    next()
  }
}
