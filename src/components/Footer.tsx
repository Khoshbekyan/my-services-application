// 📄 ՖԱՅԼ: components/Footer.tsx — ՄԱՍ 1
import Link from "next/link"

export default function Footer() {
  return (
    /* ⚡ ՖՈՆԸ ԴԱՐՁԱՎ ԽՈՐԸ ՄՈՒԳ ՍԼԵՅԹ՝ ՄԵՐ ՄՅՈՒՍ ԷՋԵՐԻ ՈՃՈՎ */
    <footer className="bg-slate-950 border-t border-slate-900/60 text-slate-400 text-sm mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 sm:px-8">
        
        {/* Վերևի մեծ բլոկը սյունակներով */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/40">
          
          {/* ⚡ Սյունակ 1: Բրենդ և Սպիտակ կոնտրաստային Լոգո (Ճիշտ ինչպես Header-ում է) */}
          <div className="flex flex-col gap-4">
            <Link href="/services" className="transition-all duration-300 hover:opacity-90 active:scale-95 flex items-center gap-2.5 self-start">
              <div className="w-8 h-8 bg-white text-slate-950 rounded-lg flex items-center justify-center text-base font-black shadow-md">
                ✓
              </div>
              <span className="text-base font-black tracking-tight text-white">
                Servify
              </span>
            </Link>
            <p className="text-slate-500 leading-relaxed max-w-xs text-xs font-semibold">
              Բացահայտեք լավագույն մասնագետներին և ծառայությունները ձեր ամենօրյա կյանքի համար։ Պարզ, արագ և անվտանգ հարթակ։
            </p>
          </div>
          {/* Սյունակ 2: Ծառայություններ */}
          <div>
            <h3 className="font-bold text-white mb-4 tracking-wide uppercase text-xs">Հարթակ</h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link href="/services" className="hover:text-white transition-colors">Ծառայություններ</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Մեր մասին</Link></li>
              <li><Link href="/bookings" className="hover:text-white transition-colors">Ամրագրումներ</Link></li>
            </ul>
          </div>

          {/* Սյունակ 3: Աջակցություն */}
          <div>
            <h3 className="font-bold text-white mb-4 tracking-wide uppercase text-xs">Աջակցություն</h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link href="#" className="hover:text-white transition-colors">Հաճախ տրվող հարցեր</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Օգնության կենտրոն</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Կապ մեզ հետ</Link></li>
            </ul>
          </div>

          {/* Սյունակ 4: Իրավական */}
          <div>
            <h3 className="font-bold text-white mb-4 tracking-wide uppercase text-xs">Իրավական</h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link href="#" className="hover:text-white transition-colors">Գաղտնիության քաղաքականություն</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Օգտագործման պայմաններ</Link></li>
            </ul>
          </div>

        </div>

        {/* Ներքևի բլոկը: Copyright & Սոց. Ցանցեր */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <p>&copy; {new Date().getFullYear()} Servify. Բոլոր իրավունքները պաշտպանված են։</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Facebook</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
