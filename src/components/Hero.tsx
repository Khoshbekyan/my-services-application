"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Hero() {
  // Լայվ սիմուլյացիայի դինամիկ տվյալները
  const servicesPreview = [
    { title: "Կապիտալ Վերանորոգում", master: "Արմեն Գ.", price: "12,000 ֏", cat: "Վերանորոգում", icon: "🛠️" },
    { title: "Ինտերիերի Դիզայն 3D", master: "Աննա Հ.", price: "25,000 ֏", cat: "Դիզայն", icon: "📐" },
    { title: "Next.js Վեբ Սայթեր", master: "Գոռ Վ.", price: "40,000 ֏", cat: "ՏՏ / Ծրագրավորում", icon: "💻" },
    { title: "Պրոֆեսիոնալ Մակյաժ", master: "Լիլիթ Ս.", price: "15,000 ֏", cat: "Գեղեցկություն", icon: "✨" }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  
  // 🔒 Սթեյթեր՝ անվտանգության և պոպ-ապ մոդալի համար
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  // 1. Ստուգում ենք օգտատիրոջ կարգավիճակը և ակտիվացնում սիմուլյատորի տայմերը
  useEffect(() => {
    // Ստուգում ենք սեսիան
    fetch("/api/profile")
      .then((res) => {
        if (res.ok) setIsAuthenticated(true)
      })
      .catch(() => setIsAuthenticated(false))

    // Լայվ անիմացիայի տայմերը (3 վայրկյանը մեկ)
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % servicesPreview.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentService = servicesPreview[currentIndex]

  // ⚡ Կոճակի սեղմման խելացի տրիգեր
  const handleBookingClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault() // Արգելում ենք անմիջապես էջափոխվելը
      setShowModal(true) // Բացում ենք բոմբաստիկ հուշող մոդալը
    }
  }

  return (
    <section className="relative min-h-[95vh] w-full flex items-center bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 overflow-hidden border-b border-slate-900 px-6 sm:px-12 md:px-16 py-20 select-none">
      
      {/* 🔮 Տիեզերական էլեգանտ լույսեր ետնաֆոնին */}
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        {/* 1. ՁԱԽ ԿՈՂՄ՝ ԲՈՄԲԱՍՏԻԿ ԳԼԽԱԳԻՐ, ՍՈՑԻԱԼԱԿԱՆ ԱՊԱՑՈՒՅՑ ԵՎ ԿՈՃԱԿՆԵՐ */}
        <div className="flex flex-col items-start text-left max-w-xl">
          
          {/* Live Market Pulse Badge */}
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 px-3.5 py-2 text-[11px] font-bold text-white shadow-xl mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="uppercase tracking-widest text-[9px] text-emerald-400 font-black">Բացառիկ Հարթակ</span>
            <span className="text-white/20">•</span>
            <span className="text-slate-300 font-medium">Առանց միջնորդների ու զանգերի</span>
          </div>

          {/* Գերժամանակակից Խոշոր Գլխագիր */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[0.92] sm:leading-[0.92]">
            Ամրագրիր <br />
            մասնագետին <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 mt-2 ">
              Մեկ Քլիքով
            </span>
          </h1>

          {/* Ոգեշնչող Ենթատեքստ */}
          <p className="mt-6 text-base md:text-lg text-slate-400 font-medium leading-relaxed">
            Հայաստանի առաջին պրեմիում հարթակը, որտեղ տաղանդավոր մասնագետները հանդիպում են իրենց հաճախորդներին։ Զրո թաքնված վճարներ, HttpOnly անվտանգություն և ակնթարթային կապ։
          </p>

          {/* 👥 Սոցիալական ապացույց (Social Proof Widget) */}
          <div className="mt-8 flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl shadow-inner">
            <div className="flex -space-x-3 overflow-hidden">
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">ԱԳ</div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">ՆՀ</div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">ՄՍ</div>
            </div>
            <div className="text-xs">
              <span className="text-white font-black block">10,000+ Հայ Օգտատերեր</span>
              <span className="text-slate-400 font-medium text-[11px]">արդեն վստահում են Servify-ին</span>
            </div>
          </div>

          {/* Գլխավոր Գործողության Կոճակներ */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link 
              href="/services" 
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-emerald-500 hover:text-white text-slate-950 font-black rounded-2xl shadow-2xl transition-all duration-300 active:scale-[0.98] text-xs uppercase tracking-wider text-center"
            >
              Բացահայտել Ծառայությունները
            </Link>
            <Link 
              href={isAuthenticated ? "/profile" : "/register"} 
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl border border-white/10 transition-all duration-300 active:scale-[0.98] text-xs uppercase tracking-wider text-center"
            >
              Գրանցվել որպես մասնագետ
            </Link>
          </div>
        </div>

        {/* 2. ԱՋ ԿՈՂՄ՝ ԻՆՏԵՐԱԿՏԻՎ ԼԱՅՎ ՍԻՄՈՒԼՅԱՏՈՐ */}
        <div className="flex items-center justify-center lg:justify-end w-full relative">
          <div className="absolute w-[360px] h-[360px] border border-white/5 rounded-[48px] rotate-12 pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Գլխավոր Բոմբաստիկ Քարտը */}
          <div className="w-full max-w-[360px] bg-white border border-slate-200/50 p-6 rounded-[36px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] rotate-[-2deg] hover:rotate-0 transition-all duration-700 group relative">
            <div className="w-full h-[200px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-[24px] relative overflow-hidden flex flex-col items-center justify-center border border-slate-800">
              <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-black text-emerald-400 font-mono shadow-md animate-pulse">
                {currentService.price}
              </div>
              <div className="absolute top-3 left-3 bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">
                {currentService.cat}
              </div>
              <div className="text-6xl filter drop-shadow-[0_10px_20px_rgba(52,211,153,0.3)] transition-transform duration-500 group-hover:scale-110 select-none">
                {currentService.icon}
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white font-bold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md">
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
                Ակտիվ Ամրագրում
              </div>
            </div>

            <div className="mt-5 px-1">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">Ակնթարթային առաջարկ</span>
              <h3 className="font-black text-slate-950 text-lg tracking-tight min-h-[28px] mt-1">
                {currentService.title}
              </h3>
              
              <div className="mt-4 flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="w-8 h-8 bg-slate-950 text-white rounded-lg flex items-center justify-center text-xs font-black shadow-sm">
                  {currentService.master.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{currentService.master}</h4>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Հավաստագրված Մասնագետ</p>
                </div>
              </div>

              {/* ⚡ Կոճակ, որը լոգին չեղած օգտատիրոջ համար բացում է պոպ-ապ մոդալը */}
              <Link 
                href="/services" 
                onClick={handleBookingClick}
                className="w-full mt-5 bg-slate-950 group-hover:bg-emerald-500 text-white text-xs font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md uppercase tracking-wider"
              >
                <span>Ամրագրել Հիմա</span>
                <span className="opacity-100 group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
      {/* ==========================================
         🔒 ՊՐԵՄԻՈՒՄ ՀՈՒՇՈՂ ՄՈԴԱԼ ՊԱՏՈՒՀԱՆ (INTERCEPTION MODAL)
      ========================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Մութ ետնաֆոն (Blur Overlay) */}
          <div 
            onClick={() => setShowModal(false)} 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300" 
          />

          {/* Բուն Մոդալ Քարտը (Premium Glassmorphism & Solid Card combo) */}
          <div className="bg-white border border-slate-100 rounded-[36px] p-8 max-w-sm w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10 text-center animate-fade-in transition-all">
            
            {/* Փակելու X կոճակը */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 font-bold text-sm h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* Շքեղ անիմացիոն էլեմենտ վերևում */}
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 text-slate-950 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-sm mb-4 animate-pulse">
              🔒
            </div>

            {/* Մոդալի տեքստերը */}
            <h3 className="text-xl font-black text-slate-950 tracking-tight leading-tight">
              Մեկ քլիք՝ և մասնագետը ձերն է
            </h3>
            
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-medium">
              Ամրագրումը կատարելու, մասնագետի իրական հեռախոսահամարը տեսնելու և ձեր անձնական պատվերները կառավարելու համար անհրաժեշտ է ունենալ **Servify** հաշիվ։
            </p>

            {/* Գործողությունների կոճակներ */}
            <div className="mt-6 flex flex-col gap-2.5">
              <Link 
                href="/login"
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md uppercase tracking-wider text-center"
              >
                Մուտք Գործել
              </Link>
              <Link 
                href="/register"
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs py-3.5 rounded-xl transition-all border border-slate-200 text-center"
              >
                Ստեղծել Նոր Հաշիվ (Անվճար)
              </Link>
            </div>

            {/* Լրացուցիչ հուշում */}
            <p className="text-[10px] text-slate-400 mt-4 font-medium">
              Գրանցումը տևում է ընդամենը 30 վայրկյան։
            </p>
          </div>
        </div>
      )}

    </section>
  )
}
