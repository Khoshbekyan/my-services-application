import { NextResponse } from "next/server"
import { connectDB } from "../../../lib/mongodb"
import { User } from "../../../models/User"
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // ⚡ ՃՇԳՐՏՎԱԾ ՏՈՂ. Ֆրոնտենդից կարդում ենք ՃԻՇՏ 'phone' անունով
    const { firstName, lastName, phone, email, password } = body

    // Ստուգում ենք, որ բոլոր պարտադիր դաշտերը լրացված լինեն
    if (!firstName || !lastName || !phone || !email || !password) {
      return NextResponse.json(
        { error: "Please fill in all fields" },
        { status: 400 }
      )
    }

    // Ստուգում ենք կրկնվող email-ը
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Հեշավորում ենք գաղտնաբառը
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Տերմինալում լոգ ենք անում ստուգելու համար
    console.log("Backend received phone:", phone)
    
    // ⚡ ԳՐՈՒՄ ԵՆՔ ԻՐԱԿԱՆ ԲԱԶԱՅԻ ՄԵՋ
    const user = await User.create({ 
      firstName, 
      lastName, 
      phone: phone.trim(), // ⚡ Հիմա իրական '+374 ...' համարը ճիշտ կգրվի
      email: email.toLowerCase(), 
      password: hashedPassword 
    })

    return NextResponse.json(
      { success: true, message: "Registration successful!" },
      { status: 200 }
    )

  } catch (error) {
    console.error("API Error during registration:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
