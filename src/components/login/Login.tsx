"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Հաջող մուտքից հետո Next.js-ի router.push-ի փոխարեն անում ենք կոշտ վերագործարկում,
        // որպեսզի հյուրի էջի քեշը լրիվ զրոյանա ու բացվի լոգին եղած /services-ը
        window.location.replace("/services")
      } else {
        setError(data.error || "Մուտքը ձախողվեց")
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
        Ստուգվում են տվյալները...
      </div>
    )
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 px-4 py-6 box-border selection:bg-emerald-500 selection:text-white font-sans select-none relative overflow-hidden">
      
      {/* Նուրբ դիզայներական լուսային էֆեկտներ ետնաֆոնին */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-slate-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Մաքուր սպիտակ պրեմիում քարտ */}
      <div className="w-full max-w-md bg-white border border-slate-200/40 p-8 sm:p-10 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.3)] relative z-10">
        
        {/* Լոգո և Վերնագիր */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-lg font-black mb-3 shadow-md">
            ✓
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Մուտք Գործել
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Բարի գալուստ, խնդրում ենք ներմուծել ձեր տվյալները
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Սխալի (error) բլոկ */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 font-semibold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {/* Էլ. Փոստ */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Էլ. փոստի հասցե
            </label>
            <input
              type="email"
              required
              placeholder="poghos@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 px-4 py-3 text-sm font-medium rounded-2xl outline-none transition-all duration-200 text-slate-900 bg-slate-50/50 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </div>

          {/* Գաղտնաբառ */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Գաղտնաբառ
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 px-4 py-3 text-sm font-medium rounded-2xl outline-none transition-all duration-200 text-slate-900 bg-slate-50/50 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </div>

          {/* Հաստատման Կոճակ */}
          <div className="mt-2">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 text-sm font-bold rounded-2xl shadow-xl shadow-slate-950/20 active:scale-[0.98] transition-all duration-200"
            >
              Մուտք գործել
            </button>

            {/* Հղում դեպի Գրանցման էջ */}
            <p className="mt-5 text-center text-xs font-semibold text-slate-400">
              Չունե՞ք հաշիվ։{" "}
              <Link 
                href="/register" 
                className="text-slate-900 font-bold hover:text-slate-700 transition-colors ml-1 underline underline-offset-4"
              >
                Գրանցվել հիմա
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}
