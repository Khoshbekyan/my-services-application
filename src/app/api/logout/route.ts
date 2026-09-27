import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Դուք հաջողությամբ դուրս եկաք համակարգից" },
      { status: 200 }
    );

    // 🚀 ԱՆԽՈՑԵԼԻ ՀԱՐՎԱԾ. Ստեղծում ենք նույն անունով դատարկ cookie 
    // և maxAge-ը դնում ենք 0 (վայրկյան): Սա բրաուզերին ՍՏԻՊՈՒՄ Է 
    // անմիջապես աղբամանը գցել HttpOnly թոքենը, path-ը պարտադիր նշում ենք "/"
    response.cookies.set("token", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
