import z from "zod"
import { config } from "dotenv"

config()

const envschema = z.object({
  PORT: z.coerce.number().int().default(8080).catch(8080),
  DATABASE_URI: z.string(),
  KEY: z.string().min(32),
  IV: z.string().min(12),
  JWT_SECRET: z.string(),
  SALT: z.coerce.number().int(),
  EMAIL_TOKEN: z.string(),
  EMAIL_ADDRESS: z.email(),
  SWAGGER_USERNAME: z.string(),
  SWAGGER_PASSWORD: z.string(),
})

export const env = envschema.parse(process.env)
