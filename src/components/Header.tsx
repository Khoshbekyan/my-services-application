import Link from "next/link"
import { cookies, headers } from "next/headers" 
import LogoutButton from "./LogoutButton"

export default async function Header() {
  // 1. Կարդում ենք "token" cookie-ն անմիջապես սերվերի վրա
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  // 2. Իմանում ենք ընթացիկ էջի հասցեն (URL-ը) ակտիվ ստիլ տալու համար
  const headerList = await headers()
  const activePath = headerList.get("x-invoke-path") || ""

  // Եթե տոկենը կա, ակտիվ էջը կլինի /services, եթե չկա՝ /
  const currentDefaultPath = token ? "/services" : "/"
  const isLinkActive = (path: string) => activePath === path || (activePath === "/" && path === "/");

  return (
    /* ⚡ ՀԵԱԴԵՐԸ ԴԱՐՁԱՎ ԽՈՐԸ ՄՈՒԳ ՍԼԵՅԹ՝ ԱՊԱԿՈՒ ՇՔԵՂ ԷՖԵԿՏՈՎ (Frosted Glass) */
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-lg shadow-[0_2px_30px_rgba(0,0,0,0.3)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        
        {/* ԼՈԳՈ — Մաքուր սպիտակ կոնտրաստային դիզայնով */}
        <Link href={currentDefaultPath} className="transition-all duration-300 hover:opacity-90 active:scale-95 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white text-slate-950 rounded-xl flex items-center justify-center text-lg font-black shadow-md">
            ✓
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Servify
          </span>
        </Link>

        {/* Նավիգացիոն Մենյու */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-slate-400">
          
          {/* Ծառայություններ */}
          <Link
            href={currentDefaultPath}
            className={`relative px-4 py-2 rounded-full transition-all duration-200 hover:text-white hover:bg-slate-900/60 ${
              isLinkActive(currentDefaultPath) ? "text-white bg-slate-900 font-extrabold" : ""
            }`}
          >
            Ծառայություններ
            {isLinkActive(currentDefaultPath) && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
            )}
          </Link>

          {/* Մեր մասին */}
          <Link
            href="/about"
            className={`relative px-4 py-2 rounded-full transition-all duration-200 hover:text-white hover:bg-slate-900/60 ${
              isLinkActive("/about") ? "text-white bg-slate-900 font-extrabold" : ""
            }`}
          >
            Մեր մասին
            {isLinkActive("/about") && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
            )}
          </Link>

          {/* Իմ պատվերները — Երևում է միայն լոգին եղածներին */}
          {token && (
            <Link
              href="/bookings"
              className={`relative px-4 py-2 rounded-full transition-all duration-200 hover:text-white hover:bg-slate-900/60 ${
                isLinkActive("/bookings") ? "text-white bg-slate-900 font-extrabold" : ""
              }`}
            >
              Պատվերներ
              {isLinkActive("/bookings") && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </Link>
          )}

          {/* Անձնական էջ — Երևում է միայն լոգին եղածներին */}
          {token && (
            <Link
              href="/profile"
              className={`relative px-4 py-2 rounded-full transition-all duration-200 hover:text-white hover:bg-slate-900/60 ${
                isLinkActive("/profile") ? "text-white bg-slate-900 font-extrabold" : ""
              }`}
            >
              Պրոֆիլ
              {isLinkActive("/profile") && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </Link>
          )}

          <span className="w-[1px] h-5 bg-slate-800/80 mx-2 hidden sm:inline-block" />

          {/* ⚡ ՄՈՒՏՔ / ԵԼՔ (Ելքի կոճակը ավտոմատ կստանա սրա ստիլը LogoutButton-ի ներսում) */}
          {token ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white hover:bg-slate-100 text-slate-950 px-5 py-2 text-xs font-black shadow-sm transition-all duration-200 active:scale-[0.97]"
            >
              Մուտք
            </Link>
          )}
        </nav>

      </div>
    </header>
  )
}
