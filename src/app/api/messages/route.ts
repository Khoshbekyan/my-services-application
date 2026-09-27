import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { Chat } from "../../../models/Chat";
import { Message } from "../../../models/Messages";
import { Notification } from "../../../models/Notification";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "";

// 🔒 Օգնող ֆունկցիա՝ տոկենից օգտատիրոջ ID-ն իմանալու համար
async function getUserIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; userId: string };
    return decoded.id || decoded.userId;
  } catch {
    return null;
  }
}

// 1. GET — Բեռնել չաթերի ցուցակը կամ կոնկրետ չաթի նամակների պատմությունը
export async function GET(request: Request) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Մուտքն արգելված է" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    // 🎯 ՏԱՐԲԵՐԱԿ Ա. Եթե հարցման մեջ կա chatId, բերում ենք նամակները
    if (chatId) {
      const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
      return NextResponse.json(messages, { status: 200 });
    }

    // 🎯 ՏԱՐԲԵՐԱԿ Բ. Եթե chatId չկա, բերում ենք բոլոր ակտիվ չաթերի ցուցակը
    const userChats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name firstName lastName email")
      .sort({ updatedAt: -1 });

    // Ֆորմատավորում ենք չաթերը ֆրոնտենդի համար
    const formattedChats = userChats.map((chat) => {
      const otherUser = chat.participants.find(
        (p: any) => p._id.toString() !== userId.toString()
      );
      return {
        _id: chat._id,
        lastMessage: chat.lastMessage,
        updatedAt: chat.updatedAt,
        otherUser: otherUser || { _id: userId, email: "Իմ հաշիվը" },
      };
    });

    return NextResponse.json(formattedChats, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// 2. POST — Ուղարկել նոր նամակ (ստեղծել չաթ + նամակ + 🔔 ծանուցում)
export async function POST(request: Request) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Մուտքն արգելված է" }, { status: 401 });
    }

    const { recipientId, text } = await request.json();
    if (!recipientId || !text.trim()) {
      return NextResponse.json({ error: "Տվյալները թերի են" }, { status: 400 });
    }

  // 🔍 1. Ստուգում ենք՝ արդյո՞ք արդեն կա ստեղծված չաթ սենյակ (ՈՒՂՂՎԱԾ ՏՈՂ)
    let chat = await Chat.findOne({
      participants: { $all: [userId, recipientId] }, // 🎯 ՃԻՇՏ Է ԱՅՍՊԵՍ
    });

    // Եթե չկա, ստեղծում ենք նոր չաթ սենյակ
    if (!chat) {
      chat = await Chat.create({
        participants: [userId, recipientId],
      });
    }

    // 📝 2. Ստեղծում ենք բուն նամակը
    const newMessage = await Message.create({
      chatId: chat._id,
      senderId: userId,
      text: text.trim(),
    });

    // 🔄 3. Թարմացնում ենք չաթի վերջին նամակի տեքստը ցուցակի համար
    chat.lastMessage = text.trim();
    await chat.save();

    // 🔔 4. ԱՎՏՈՄԱՏ ԾԱՆՈՒՑՈՒՄ ՍՏԱՑՈՂԻՆ (Զանգակի համար)
    const DynamicUserModel = mongoose.models.User || mongoose.model("User");
    const senderUser = await DynamicUserModel.findById(userId);
    const senderName = senderUser?.name || 
                       (senderUser?.firstName ? `${senderUser.firstName} ${senderUser.lastName || ""}` : "Օգտատեր");

    // 🎯 ՈՒՂՂՎԱԾ ՏՈՂ. Հանեցինք սմայլիկը, որ ֆրոնտենդում իկոնա դնենք
    await Notification.create({
      userId: recipientId,
      text: `Նոր նամակ ${senderName}-ից. «${text.trim().substring(0, 30)}${text.trim().length > 30 ? "..." : ""}»`,
      isRead: false,
    });

    return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
