"use client"

export default function LogoutButton() {
  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault()

    try {
      // 1. Կանչում ենք բեքենդ API-ն, որը կջնջի cookie-ն սերվերից
      await fetch("/api/logout", { method: "GET" })

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
    className="flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 px-4 py-2 text-xs font-bold border border-slate-800/80 transition-all duration-200 active:scale-[0.97]"
  >
    <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
    Ելք
  </button>
)
}
