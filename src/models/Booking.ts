import mongoose, { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // Կապում ենք ծառայության մոդելի հետ
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Կապում ենք պատվիրող օգտատիրոջ հետ
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending", // Լռելյայն կարգավիճակը
    },
  },
  { timestamps: true }
);

export const Booking = models.Booking || model("Booking", BookingSchema);
