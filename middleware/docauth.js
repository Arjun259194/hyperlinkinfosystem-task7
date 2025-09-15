import basicAuth from "basic-auth"
import { env } from "../env.js"

export default function docauth(req, res, next) {
  const credentials = basicAuth(req)
  if (
    !credentials ||
    credentials.name !== env.SWAGGER_USERNAME ||
    credentials.pass !== env.SWAGGER_PASSWORD
  ) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required")
    res.status(401).send("Unauthorized.")
  } else {
    next()
  }
}
