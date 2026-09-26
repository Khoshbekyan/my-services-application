// 📄 ՖԱՅԼ: models/User.ts
import mongoose, { Schema } from "mongoose"

const UserSchema = new Schema(
  {
    // ⚡ Հին name-ի փոխարեն ավելացան Անունն ու Ազգանունը
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" }, // Հեռախոսահամարի դաշտը
    role: { type: String, default: "user" }
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model("User", UserSchema)
