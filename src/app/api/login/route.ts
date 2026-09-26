import { NextResponse } from "next/server"
import { connectDB } from "../../../lib/mongodb"
import { cookies } from "next/headers"
import { User } from "../../../models/User"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Խնդրում ենք լրացնել բոլոր դաշտերը" },
        { status: 400 }
      )
    }

    // ⚡ ՈՒՂՂՎԱԾ ՏՈՂ. Փնտրում ենք միայն փոքրատառերով, որ մեծատառի խնդիր չլինի
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { error: "Այս էլ. հասցեով օգտատեր չի գտնվել" },
        { status: 400 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Գաղտնաբառը սխալ է" },
        { status: 400 }
      )
    }

    const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key"
    
    // ⚡ ԼՐԱՄՇԱԿՎԱԾ ՏՈԿԵՆ. Պահում ենք և՛ userId, և՛ id անվտանգության համար
    const token = jwt.sign(
      { 
        userId: user._id, 
        id: user._id, // Հիմա սա կարդալու է նաև ծառայությունների API-ն
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    const cookieStore = await cookies()
    
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Մուտքը հաջողությամբ կատարվեց"
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("API Էրրոր:", error)
    return NextResponse.json(
      { error: "Սերվերի ներքին սխալ" },
      { status: 500 }
    )
  }
}
