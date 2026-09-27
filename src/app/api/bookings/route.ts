import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { Booking } from "../../../models/Booking";
import { Notification } from "../../../models/Notification"; // ✅ ՈՒՂՂՎԱԾ. Ավելացվեց ծանուցումների մոդելը
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

// 1. POST — Ստեղծել նոր ամրագրում և ավտոմատ ծանուցել վարպետին
export async function POST(request: Request) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Մուտքը արգելված է: Խնդրում ենք լոգին լինել" }, { status: 401 });
    }

    const { serviceId } = await request.json();
    if (!serviceId) {
      return NextResponse.json({ error: "Ծառայության ID-ն բացակայում է" }, { status: 400 });
    }

    // Ամրագրումը գրանցում ենք բազայում
    const newBooking = await Booking.create({
      serviceId,
      customerId: userId,
      status: "Pending",
    });

    // ✅ ՈՒՂՂՎԱԾ. Այս ամբողջ բլոկը ճիշտ տեղափոխվեց POST ֆունկցիայի ներսը
    const ServiceModel = mongoose.models.Service || mongoose.model("Service");
    const targetService = await ServiceModel.findById(serviceId);

    if (targetService) {
      await Notification.create({
        userId: targetService.userId, // Ծանուցումը գնում է Անահիտին
        text: `⚡ Նոր ամրագրում: Ձեր «${targetService.title}» ծառայությունը պատվիրել են:`,
      });
    }

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. GET — Բեռնել ընթացիկ օգտատիրոջ բոլոր ամրագրումները
export async function GET() {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Չնախատեսված մուտք" }, { status: 401 });
    }

    // Կարդում ենք պատվերները և ավտոմատ բերում ծառայության մանրամասները (populate)
    const userBookings = await Booking.find({ customerId: userId })
      .populate("serviceId")
      .sort({ createdAt: -1 });

    return NextResponse.json(userBookings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
