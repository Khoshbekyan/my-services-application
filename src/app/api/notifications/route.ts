import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { Notification } from "../../../models/Notification";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

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

// 1. GET — ԲԵՌՆՈՒՄ Է ԾԱՆՈՒՑՈՒՄՆԵՐԸ ԱՌԱՆՑ ՍՏԱՏՈՒՍ ՓՈԽԵԼՈՒ (Այլևս չի կորչի!)
export async function GET() {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json([], { status: 200 });

    // 🎯 Կարդում ենք վերջին 20 ծանուցումները (և՛ կարդացված, և՛ չկարդացված)
    const allNotifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(allNotifications, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. PUT — ՄԻԱՅՆ ԱՅՍՏԵՂ Է ՓՈԽՎՈՒՄ ԿԱՐԳԱՎԻՃԱԿԸ (Երբ Անահիտը սեղմում է զանգակը)
export async function PUT() {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Բոլոր չկարդացվածները դարձնում ենք կարդացված
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
