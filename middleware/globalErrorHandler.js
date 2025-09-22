/**
 * Global error handling middleware for Express.
 * Catches errors thrown or passed via next(err) from any route.
 *
 * @param {Error} err - The error object
 * @param {import("express").Request} req - Express request
 * @param {import("express").Response} res - Express response
 * @param {import("express").NextFunction} next - Express next middleware function
 */
export function globalErrorHandler(err, _, res, _next) {
  // Extract message and code
  const code = err.code || 500
  const msg = err?.message || "Internal Server Error"

  // Extract where error was thrown from stack trace (first stack line after message)
  let origin = "Unknown location"
  if (err.stack) {
    // stack trace format: Error: message\n at file:line:col ...
    const stackLines = err.stack.split("\n").slice(1)
    if (stackLines.length > 0) {
      // Simplify stack frame info (remove 'at' and extra parts)
      origin = stackLines[0].trim().replace(/^at\s+/g, "")
    }
  }

  // Log concise error info
  console.error(`\n[Error] Message : ${msg}`)
  console.error(`[Error] Code    : ${code}`)
  console.error(`[Error] Location: ${origin}`)
  console.error(`[Error] Stack Trace:\n${err.stack}\n`)

  // Respond with json error
  const obj = err?.obj || {}
  res.status(code).json({
    code,
    message: msg,
    success: false,
    ...obj,
  })
}

export default class ErrorResponse extends Error {
  /**
   *
   * @param {string} message
   * @param {number} code
   */
  constructor(message, code, obj = null) {
    super(message)
    this.name = "Express API Error"
    this.code = code
    this.obj = obj
  }
}
