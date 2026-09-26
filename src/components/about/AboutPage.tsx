"use client"

import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 lg:px-8 py-24 font-sans text-slate-800 antialiased relative overflow-hidden select-none">
      
      {/* Պրեմիում դիզայներական նուրբ լույսեր ետնաֆոնին */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-3xl bg-white rounded-[32px] border border-slate-200/40 shadow-2xl p-6 sm:p-10 relative z-10">
        
        {/* Հետադարձ հղում դեպի գլխավոր էջ */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider">
            ← Հետ դեպի ծառայություններ
          </Link>
        </div>

        {/* Գլխավոր Վերնագիր և Ներածություն */}
        <div className="border-b border-slate-100 pb-6 mb-8">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">Հարթակի մասին</span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-3">
            Servify Armenia
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-500 mt-3 leading-relaxed">
            Servify-ը նորարարական թվային հարթակ է, որը կապում է լավագույն անկախ մասնագետներին և ծառայությունների կարիք ունեցող օգտատերերին ողջ Հայաստանում՝ ապահովելով պարզ, արագ և թափանցիկ գործընթաց։
          </p>
        </div>

        {/* 📈 Պրեմիում Մինիմալիստական Ստատիստիկա (Stats) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-slate-50/80 border border-slate-100 p-5 rounded-2xl mb-8 text-center select-none shadow-sm">
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-slate-950">10,000+</span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Օգտատեր</span>
          </div>
          <div className="border-x border-slate-200/60">
            <span className="block text-2xl sm:text-3xl font-black text-emerald-600">500+</span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Մասնագետ</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-slate-950">4.9 / 5.0</span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Վարկանիշ</span>
          </div>
        </div>
        {/* Մեր Առաքելությունը */}
        <div className="mb-8">
          <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2.5 flex items-center gap-2">
            🚀 Մեր առաքելությունը
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            Պարզեցնել ծառայությունների որոնման, համեմատման և ամրագրման ամենօրյա գործընթացը։ Մենք հնարավորություն ենք տալիս տաղանդավոր մասնագետներին ինքնուրույն կառավարել իրենց բիզնեսը և գտնել հաճախորդներ, իսկ պատվիրատուներին՝ արագ և ապահով ամրագրել որակյալ ծառայություններ՝ առանց անվերջանալի զանգերի ու ժամանակի կորստի։
          </p>
        </div>

        {/* 💎 Ինչո՞ւ ընտրել մեզ */}
        <div className="mb-8 pt-6 border-t border-slate-100">
          <h3 className="text-base sm:text-lg font-black text-slate-900 mb-5">Ինչո՞ւ ընտրել Servify-ը</h3>
          
          <div className="flex flex-col gap-4">
            {/* Կետ 1 */}
            <div className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-slate-50/50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center font-bold shrink-0 shadow-md">
                ✓
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Ստուգված մասնագետներ</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">Բոլոր հայտարարատուները անցնում են որակի, փորձի և հուսալիության նախնական մոդերացիա ու ստուգում։</p>
              </div>
            </div>

            {/* Կետ 2 */}
            <div className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-slate-50/50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold shrink-0 border border-emerald-100/50 shadow-sm">
                ⏰
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Արագ ամրագրում և կապ</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">Ընտրեք ձեզ հարմար ծառայությունը, տեսեք իրական արժեքը և կապ հաստատեք մասնագետի հետ մեկ հպումով։</p>
              </div>
            </div>

            {/* Կետ 3 */}
            <div className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-slate-50/50 transition-colors border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold shrink-0 border border-indigo-100/50 shadow-sm">
                🔒
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Թափանցիկություն</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">Չկան թաքնված միջնորդավճարներ կամ հավելյալ ծախսեր։ Դուք միշտ տեսնում եք իրական ֆիքսված գները:</p>
              </div>
            </div>
          </div>
        </div>
        {/* 🛠️ Ինչպե՞ս է աշխատում համակարգը */}
        <div className="mb-8 pt-6 border-t border-slate-100">
          <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4">Ինչպե՞ս է այն աշխատում</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 block mb-1">Քայլ 01</span>
              <h5 className="text-sm font-bold text-slate-900 mb-1">Որոնում</h5>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Գտեք ձեզ անհրաժեշտ ծառայությունը մեր ճկուն ֆիլտրերի միջոցով։</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 block mb-1">Քայլ 02</span>
              <h5 className="text-sm font-bold text-slate-900 mb-1">Համեմատում</h5>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Ուսումնասիրեք իրական գները, նկարագրությունն ու մասնագետի տվյալները։</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 block mb-1">Քայլ 03</span>
              <h5 className="text-sm font-bold text-slate-900 mb-1">Ամրագրում</h5>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Կապվեք հեռախոսով կամ ամրագրեք ծառայությունը ընդամենը մեկ քլիքով։</p>
            </div>
          </div>
        </div>

        {/* Կոնտակտային բաժին */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Ունե՞ք հարցեր կամ առաջարկներ</h4>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Մեր աջակցման թիմը միշտ պատրաստ է օգնել ձեզ։</p>
          </div>
          <a 
            href="mailto:support@servify.am" 
            className="inline-block bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all duration-200 active:scale-[0.97] text-center shadow-md"
          >
            Կապնվել մեզ հետ
          </a>
        </div>

      </div>
    </div>
  )
}
