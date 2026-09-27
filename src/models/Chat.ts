import mongoose, { Schema, model, models } from "mongoose";

const ChatSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Կապում ենք User մոդելի հետ
      },
    ],
    lastMessage: {
      type: String, // Ցույց տալու համար վերջին գրված նամակը ցուցակում
      default: "",
    },
  },
  { timestamps: true }
);

export const Chat = models.Chat || model("Chat", ChatSchema);
