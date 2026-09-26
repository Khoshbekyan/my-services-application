// 📄 ՖԱՅԼ: app/api/services/route.ts
import { NextResponse } from "next/server"
import { connectDB } from "../../../lib/mongodb"
import { Service } from "../../../models/Service"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await connectDB()

    // Վերցնում ենք ԱՄԲՈՂՋ հայտարարությունները բազայից (առանց pagination-ի)
    const rawServices = await Service.find({})
      .populate("userId", "firstName lastName phone")
      .sort({ createdAt: -1 }) // Լռելյայն միշտ նորից հին
      .lean()

    const services = rawServices.map((service: any) => ({
      ...service,
      _id: service._id.toString(),
      userId: service.userId ? {
        _id: service.userId._id.toString(),
        phone: service.userId.phone || "",
        name: `${service.userId.firstName || ""} ${service.userId.lastName || ""}`.trim()
      } : null
    }))

    return NextResponse.json(services, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    })
  } catch (error) {
    console.error("API Error during fetching services:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST ֆունկցիան մնում է նույնությամբ...
export async function POST(request: Request) {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    
    let decoded: any
    try { decoded = jwt.verify(token, JWT_SECRET) } catch {
      return NextResponse.json({ error: "Invalid token." }, { status: 401 })
    }

    const userId = decoded.userId
    const body = await request.json()
    const { title, price, category, description } = body

    if (!title || !price || !description) {
      return NextResponse.json({ error: "Please fill in all fields" }, { status: 400 })
    }

    const newService = await Service.create({
      title,
      price: price.includes("֏") ? price : `${price} ֏`,
      category,
      status: "Նոր",
      description,
      userId
    })

    return NextResponse.json({ success: true, service: newService }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
