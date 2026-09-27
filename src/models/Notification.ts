import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, // Լռելյայն չկարդացված է
    }, // 👈 ✅ ՈՒՂՂՎԱԾ. Այս փակագիծը հետ դրվեց իր տեղը
    
    // ⚡ ԱՎՏՈՄԱՏ ՋՆՋՈՒՄ 30 ՕՐ ՀԵՏՈ
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30, // 30 օր = 2,592,000 վայրկյան
    },
  },
  { timestamps: true }
);

export const Notification = models.Notification || model("Notification", NotificationSchema);
