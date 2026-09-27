import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 🎯 ✅ Օգտագործում ենք POST մեթոդը, որը կանչվում է Header-ից
export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // 🚀 ԱՄԵՆԱԿԱՐԵՎՈՐ ՏՈՂԸ. Ջնջում ենք Token-ի cookie-ն հենց սերվերից
    cookieStore.delete("token");

    // Հետ ենք ուղարկում մաքուր պատասխան, որ ֆրոնտենդը հանգիստ անցնի առաջ
    return NextResponse.json(
      { success: true, message: "Դուք հաջողությամբ դուրս եկաք համակարգից" }, 
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
