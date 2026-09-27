import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ո՞ւմ է պատկանում այս ծանուցումը (ստացողը)
      required: true,
    },
    text: {
      type: String, // Ծանուցման տեքստը
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, // Լռելյայն չկարդացված է
    },
  },
  { timestamps: true }
);

export const Notification = models.Notification || model("Notification", NotificationSchema);
