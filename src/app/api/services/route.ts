import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { Service } from "../../../models/Service";
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

// 1. GET — Բեռնել բոլոր ծառայությունները և կպցնել վարպետների տվյալները (User populate)
export async function GET() {
  try {
    await connectDB();
    const allServices = await Service.find({})
      .populate("userId", "name firstName lastName phone email")
      .sort({ createdAt: -1 });
    return NextResponse.json(allServices, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST — Ստեղծել նոր հայտարարություն (Կատեգորիա + Ենթակատեգորիա + 🎯 Տարածք)
export async function POST(request: Request) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ error: "Մուտքն արգելված է: Խնդրում ենք լոգին լինել" }, { status: 401 });
    }

    const { title, price, category, subCategory, location, description } = await request.json();
    if (!title || !price || !category || !description) {
      return NextResponse.json({ error: "Տվյալները թերի են" }, { status: 400 });
    }

    const newService = await Service.create({
      title,
      price,
      category,
      subCategory: subCategory || "",
      location: location || "", 
      description,
      userId,
      status: "Նոր",
    });

    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. 🔄 PUT — ԽՄԲԱԳՐԵԼ / ԹԱՐՄԱՑՆԵԼ ՍԵՓԱԿԱՆ ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆԸ (ՆՈՐ ՖՈՒՆԿՑԻԱ)
export async function PUT(request: Request) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    
    // Ստուգում ենք լոգին եղած լինելը
    if (!userId) {
      return NextResponse.json({ error: "Մուտքն արգելված է" }, { status: 401 });
    }

    const { serviceId, title, price, location, description } = await request.json();
    if (!serviceId || !title || !price || !description) {
      return NextResponse.json({ error: "Լրացրեք բոլոր պարտադիր դաշտերը" }, { status: 400 });
    }

    // 🔍 Գտնում ենք հայտարարությունը և համոզվում, որ խմբագրողը հենց տվյալ ծառայության տերն է
    const targetService = await Service.findOne({ _id: serviceId, userId: userId });
    if (!targetService) {
      return NextResponse.json(
        { error: "Հայտարարությունը չի գտնվել կամ դուք չունեք այն փոխելու թույլտվություն" }, 
        { status: 404 }
      );
    }

    // 🔄 Թարմացնում ենք տվյալները MongoDB բազայում
    targetService.title = title;
    targetService.price = price;
    targetService.location = location || "";
    targetService.description = description;
    
    await targetService.save();

    // 🎯 ✅ ՈՒՂՂՎԱԾ. Հետ ենք ուղարկում մաքուր JSON պատասխան, որ ֆրոնտենդի res.json()-ը չկոտրվի
    return NextResponse.json({ success: true, message: "Հայտարարությունը հաջողությամբ թարմացվեց", data: targetService }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. 🗑️ DELETE — Ջնջել սեփական հայտարարությունը պրոֆիլից
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const userId = await getUserIdFromToken();
    
    if (!userId) {
      return NextResponse.json({ error: "Մուտքն արգելված է" }, { status: 401 });
    }

    const { serviceId } = await request.json();
    if (!serviceId) {
      return NextResponse.json({ error: "Հայտարարության ID-ն բացակայում է" }, { status: 400 });
    }

    const targetService = await Service.findOne({ _id: serviceId, userId: userId });
    
    if (!targetService) {
      return NextResponse.json(
        { error: "Հայտարարությունը չի գտնվել կամ դուք չունեք այն ջնջելու թույլտվություն" }, 
        { status: 404 }
      );
    }

    await Service.deleteOne({ _id: serviceId });

    return NextResponse.json({ success: true, message: "Հայտարարությունը հաջողությամբ ջնջվեց" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
