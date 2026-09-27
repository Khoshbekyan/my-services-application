import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB as dbConnect } from "@/src/lib/mongodb";
import { User } from "@/src/models/User";
import { Service } from "@/src/models/Service"; // 👈 Ներմուծում ենք հայտարարությունների մոդելը

const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// 1. GET: Օգտատիրոջ և ՄԻԱՅՆ ԻՐ հայտարարությունների ստացում
// ==========================================
export async function GET() {
  try {
    await dbConnect();

    // Կարդում ենք HttpOnly Cookie տոկենը
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // ⚡ Ստուգում ենք, որ դատարկ չլինի
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT_SECRET missing" },
        { status: 500 },
      );
    }
    // Վավերացնում ենք տոկենը
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    // Փնտրում ենք օգտատիրոջը բազայում՝ առանց пароль-ի
    const user = await User.findById(decoded.userId).select("-password").lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Վերցնում ենք ՄԻԱՅՆ այս օգտատիրոջ ստեղծած հայտարարությունները
    const myServices = await Service.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Միավորում ենք օգտատիրոջ տվյալները և իր հայտարարությունները մեկ JSON-ի մեջ
    return NextResponse.json({
      ...user,
      myServices: myServices, // 👈 Ուղարկում ենք ֆրոնտենդ
    });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
// ==========================================
// 2. PUT: Օգտատիրոջ տվյալների թարմացում
// ==========================================
export async function PUT(request: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "Սերվերի կարգավորումների սխալ (JWT_SECRET-ը գտնված չէ)" },
        { status: 500 },
      );
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const body = await request.json();
    const { firstName, lastName, phone } = body;

    // Թարմացնում ենք օգտատիրոջ տվյալները բազայում
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { firstName, lastName, phone },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Վերցնում ենք թարմացված օգտատիրոջ հայտարարությունները, որպեսզի դատան չկորչի
    const myServices = await Service.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Վերադարձնում ենք հաջողության հաղորդագրությունը և ամբողջական թարմ տվյալները
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        ...user,
        myServices,
      },
    });
  } catch (error) {
    console.error("PUT Profile Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
