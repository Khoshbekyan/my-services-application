import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { Notification } from "../../../models/Notification";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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

// 1. GET — Բեռնել միայն չկարդացված ծանուցումները
export async function GET() {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json([], { status: 200 });

    const unreadNotifications = await Notification.find({ userId, isRead: false })
      .sort({ createdAt: -1 });

    return NextResponse.json(unreadNotifications, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. PUT — Բոլոր ծանուցումները նշել որպես կարդացված (երբ սեղմում են զանգակի վրա)
export async function PUT() {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
