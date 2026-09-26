"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneBody, setPhoneBody] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // ⚡ Նոր state-եր՝ Գաղտնաբառի կրկնում և Ռոբոտի ստուգում
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isNotRobot, setIsNotRobot] = useState(false)
  
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    // 1. Ստուգում ենք գաղտնաբառերի համընկնումը
    if (password !== confirmPassword) {
      setError("Գաղտնաբառերը չեն համընկնում")
      return
    }

    // 2. Ստուգում ենք՝ արդյոք սեղմել է «Ես ռոբոտ չեմ»
    if (!isNotRobot) {
      setError("Խնդրում ենք հաստատել, որ դուք ռոբոտ չեք")
      return
    }

    const cleanPhoneBody = phoneBody.replace(/\s+/g, "")
    if (cleanPhoneBody.length < 8) {
      setError("Խնդրում ենք ներմուծել վավեր հեռախոսահամար")
      return
    }

    setLoading(true)
    const fullPhoneNumber = `+374 ${cleanPhoneBody}`

    try {
      const response = await fetch("/api/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone: fullPhoneNumber, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/login") 
      } else {
        if (data.error === "An account with this email already exists") {
          setError("Այս էլ. հասցեով հաշիվ արդեն գոյություն ունի")
        } else if (data.error === "Please fill in all fields") {
          setError("Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը")
        } else {
          setError(data.error || "Գրանցումը ձախողվեց")
        }
      }
    } catch (err) {
      setError("Ցանցային սխալ: Խնդրում ենք փորձել մի փոքր ուշ")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans select-none text-slate-500 text-sm font-semibold">
        <svg className="animate-spin h-6 w-6 text-emerald-500 mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Ստեղծվում է ձեր հաշիվը...
      </div>
    )
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 px-4 py-4 box-border selection:bg-emerald-500 selection:text-white font-sans select-none relative overflow-hidden">
      
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-slate-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200/40 p-6 sm:p-8 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.3)] relative z-10">
        
        {/* Վերնագիր */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-lg font-black mb-2.5 shadow-md">
            ✓
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Ստեղծել Հաշիվ
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Միացեք Servify-ին և առաջարկեք ձեր ծառայությունները
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 font-semibold px-4 py-2 rounded-2xl text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {/* Անուն և Ազգանուն */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Անուն</label>
              <input
                type="text"
                required
                placeholder="Պողոս"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-slate-200 px-4 py-2.5 text-sm font-medium rounded-2xl outline-none transition-all duration-200 text-slate-900 bg-slate-50/50 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Ազգանուն</label>
              <input
                type="text"
                required
                placeholder="Պողոսյան"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-slate-200 px-4 py-2.5 text-sm font-medium rounded-2xl outline-none transition-all duration-200 text-slate-900 bg-slate-50/50 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* Հեռախոսահամար */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Հեռախոսահամար</label>
            <div className="relative w-full flex items-center overflow-hidden border border-slate-200 rounded-2xl bg-slate-50/50 focus-within:border-slate-900 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100 transition-all duration-200">
              <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-slate-500 bg-slate-100/80 h-[38px] px-3 border-r border-slate-200 select-none">
                <span>🇦🇲</span>
                <span className="tracking-tighter">+374</span>
              </div>
              <input
                type="tel"
                required
                maxLength={9}
                placeholder="99 000000"
                value={phoneBody}
                onChange={(e) => setPhoneBody(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full h-[38px] px-4 text-sm font-mono font-bold outline-none text-slate-900 bg-transparent tracking-widest"
              />
            </div>
          </div>
          {/* Էլ. Փոստ */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Էլ. փոստի հասցե</label>
            <input
              type="email"
              required
              placeholder="poghos@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 px-4 py-2.5 text-sm font-medium rounded-2xl outline-none transition-all duration-200 text-slate-900 bg-slate-50/50 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </div>

          {/* ⚡ ԳԱՂՏՆԱԲԱՌ ԵՎ ԿՐԿՆՈՒՄ (Դրվեցին կողք-կողքի, որ տեղավորվի) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Գաղտնաբառ</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 px-4 py-2.5 text-sm font-medium rounded-2xl outline-none transition-all duration-200 text-slate-900 bg-slate-50/50 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Կրկնել</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-200 px-4 py-2.5 text-sm font-medium rounded-2xl outline-none transition-all duration-200 text-slate-900 bg-slate-50/50 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* ⚡ ԽԵԼԱՑԻ «ԵՍ ՌՈԲՈՏ ՉԵՄ» ԲԼՈԿ (reCAPTCHA style) */}
          <div className="mt-1 flex items-center justify-between p-3 border border-slate-100 bg-slate-50/60 rounded-2xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isNotRobot}
                onChange={(e) => setIsNotRobot(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded-md border-slate-300 cursor-pointer transition-all"
              />
              <span className="text-xs font-bold text-slate-700">Ես ռոբոտ չեմ</span>
            </label>
            {/* reCAPTCHA-յի փոքրիկ խորհրդանշական լոգոն */}
            <div className="flex flex-col items-center opacity-40">
              <span className="text-[14px]">🤖</span>
              <span className="text-[7px] font-bold tracking-tighter text-slate-500 uppercase">reCAPTCHA</span>
            </div>
          </div>

          {/* Կոճակ */}
          <div className="mt-2">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 text-sm font-bold rounded-2xl shadow-xl shadow-slate-950/20 active:scale-[0.98] transition-all duration-200"
            >
              Գրանցվել
            </button>

            <p className="mt-4 text-center text-xs font-semibold text-slate-400">
              Արդեն ունե՞ք հաշիվ։{" "}
              <Link 
                href="/login" 
                className="text-slate-900 font-bold hover:text-slate-700 transition-colors ml-1 underline underline-offset-4"
              >
                Մուտք գործել
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}
