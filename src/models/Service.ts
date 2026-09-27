// 📄 ՖԱՅԼ: models/Service.ts
import mongoose, { Schema, Document } from "mongoose"

export interface IService extends Document {
  title: string
  price: string
  category: string
  status: string
  description: string
  userId: mongoose.Types.ObjectId // ⚡ Ավելացավ User-ի ID տիպը
  createdAt: Date
}

const ServiceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, default: "" }, // 🎯 Ավելացվեց ենթակատեգորիայի դաշտը
    location: { type: String, default: "" }, //🎯 Կպահի ընտրված քաղաքը/շրջանը
    status: { type: String, default: "Նոր" },
    description: { type: String, required: true },
    // ⚡ ԿԱՊԸ USER-Ի ՀԵՏ. Պահում է ստեղծողի ID-ն
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
)

export const Service = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema)
