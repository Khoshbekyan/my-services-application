import mongoose from "mongoose"

export async function connectDB() {
    // Եթե արդեն միացված է, նորից չի միանում
    if (mongoose.connection.readyState >= 1) return

    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
        throw new Error("Խնդրում ենք ավելացնել MONGODB_URI-ն")
    }

    try {
        await mongoose.connect(MONGODB_URI)
        console.log("Connected to MongoDB successfully")
    } catch (error) {
        console.error("MongoDB connection error:", error)
        throw error
    }
}