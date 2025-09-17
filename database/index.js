import mongoose from "mongoose"

export default async function connectDB(uri) {
  try {
    await mongoose.connect(uri)
    console.log(
      "\x1b[32m%s\x1b[0m",
      `
    🚀 ==========================================
       Database Connection Established! 
       MongoDB is ready to rock! 🎉
       ==========================================`
    )
  } catch (error) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      `
    ❌ ==========================================
       Database Connection Failed!
       Error: ${error}
       ==========================================`
    )
    process.exit(1)
  }
}
