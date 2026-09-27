"use client"

export default function LogoutButton() {
  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault()

    try {
      // 1. 🎯 ✅ ՈՒՂՂՎԱԾ. Կանչում ենք POST մեթոդով, որպեսզի բեքենդ API-ն ճիշտ ընդունի հարցումը
      await fetch("/api/logout", { method: "POST" })

      // 2. ⚡ ՋՆՋՈՒՄ ԵՆՔ ԲՐԱՈՒԶԵՐԻ ԵՎ NEXT.JS-Ի ՈՂՋ ՀԻՇՈՂՈՒԹՅՈՒՆԸ
      // window.location.replace-ը ամբողջությամբ զրոյացնում է Next.js-ի Router Cache-ը
      // և օգտատիրոջը որպես անցորդ հետ է ուղարկում գլխավոր "/" էջ
      window.location.replace("/")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  return (
    <button 
      onClick={handleLogout}
      className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
    >
      Ելք
    </button>
  );
}

