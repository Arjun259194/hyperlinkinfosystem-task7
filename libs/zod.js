import ErrorResponse from "../middleware/globalErrorHandler.js"
import z from "zod"

/**
 * Validate data against a Zod schema and return a tuple like Go (error, result).
 *
 * @template T
 * @param {import('zod').ZodSchema<T>} schema - The Zod schema to validate against.
 * @param {unknown} data - The data to validate.
 */
export default function Validate(
  schema,
  data,
  emessage = "Not valid data"
) {
  const parsedData = schema.safeParse(data)
  if (!parsedData.success)
    throw new ErrorResponse(emessage, 400, parsedData.error.issues[0])
  return parsedData.data
}