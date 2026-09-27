
import Link from "next/link";
import { cookies, headers } from "next/headers"; 
import LogoutButton from "./LogoutButton";
import NotificationBell from "@/src/components/Notification"; // ✅ Ներմուծում ենք զանգակը

export default async function Header() {
  // 🎯 Абсолютно точный серверный баланс авторизации
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headerList = await headers();
  const activePath = headerList.get("x-invoke-path") || "";

  const currentDefaultPath = token ? "/services" : "/";
  const isLinkActive = (path: string) => activePath === path || (activePath === "/" && path === "/");
  return (
    <>
      {/* 💻 ՀԱՄԱԿԱՐԳԻՉՆԵՐԻ (PC) ՀԱՄԱՐ ՎԵՐԵՎԻ navbar-ը */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-lg shadow-[0_2px_30px_rgba(0,0,0,0.3)]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* ԼՈԳՈ */}
          <Link href={currentDefaultPath} className="transition-all duration-300 hover:opacity-90 active:scale-95 flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white text-slate-950 rounded-xl flex items-center justify-center text-lg font-black shadow-md">
              ✓
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Servify
            </span>
          </Link>

          {/* 🖥 ԴԵՍՔԹՈՓ ՄԵՆՅՈՒ — PC տարբերակ */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-400">
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

            {/* 💬 ՆԱՄԱԿՆԵՐ */}
            {token && (
              <Link
                href="/messages"
                className={`relative px-4 py-2 rounded-full transition-all duration-200 hover:text-white hover:bg-slate-900/60 ${
                  isLinkActive("/messages") ? "text-white bg-slate-900 font-extrabold" : ""
                }`}
              >
                Հաղորդագրություններ
                {isLinkActive("/messages") && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </Link>
            )}

            {/* Պրոֆիլ */}
            {token && (
              <Link
                href="/profile"
                className={`relative px-4 py-2 rounded-full transition-all duration-200 hover:text-white hover:bg-slate-900/60 ${
                  isLinkActive("/profile") ? "text-white bg-slate-900 font-extrabold" : ""
                }`}
              >
                Իմ պրոֆիլը
                {isLinkActive("/profile") && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </Link>
            )}

            <span className="w-[1px] h-5 bg-slate-800/80 mx-2" />

            {/* ✅ ԶԱՆԳԱԿ ԵՎ ԵԼՔԻ ԿՈՃԱԿ PC-Ի ՀԱՄԱՐ */}
            {token ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-white hover:bg-slate-100 text-slate-950 px-5 py-2 text-xs font-black shadow-sm transition-all duration-200 active:scale-[0.97]"
              >
                Մուտք
              </Link>
            )}
          </nav>

          {/* 📱 ՄՈԲԱՅԼ ՄԵՆՅՈՒ (ՎԵՐԵՎԻ ՄԱՍ) */}
          <div className="md:hidden flex items-center">
            {token ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-white hover:bg-slate-100 text-slate-950 px-4 py-1.5 text-xs font-black shadow-sm transition-all duration-200 active:scale-[0.97]"
              >
                Մուտք
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* 📱 ՀԵՌԱԽՈՍՆԵՐԻ (MOBILE) ՀԱՄԱՐ ՆԵՐՔԵՎԻ NAV BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-900 px-2 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <nav className="flex items-center justify-around text-[11px] font-bold text-slate-400">
          {/* Ծառայություններ */}
          <Link
            href={currentDefaultPath}
            className={`flex flex-col items-center gap-1 min-w-[60px] py-1 transition-all duration-150 ${
              isLinkActive(currentDefaultPath) ? "text-white font-black scale-105" : "opacity-70"
            }`}
          >
            <span className="text-base">💼</span>
            <span>Ծառայություններ</span>
          </Link>

          {/* Մեր մասին */}
          <Link
            href="/about"
            className={`flex flex-col items-center gap-1 min-w-[60px] py-1 transition-all duration-150 ${
              isLinkActive("/about") ? "text-white font-black scale-105" : "opacity-70"
            }`}
          >
            <span className="text-base">ℹ️</span>
            <span>Մեր մասին</span>
          </Link>

          {/* 💬 ՆԱՄԱԿՆԵՐ */}
          {token && (
            <Link
              href="/messages"
              className={`flex flex-col items-center gap-1 min-w-[60px] py-1 transition-all duration-150 ${
                isLinkActive("/messages") ? "text-white font-black scale-105" : "opacity-70"
              }`}
            >
              <span className="text-base">💬</span>
              <span>Հաղորդագրություններ</span>
            </Link>
          )}

          {/* Պրոֆիլ */}
          {token && (
            <Link
              href="/profile"
              className={`flex flex-col items-center gap-1 min-w-[60px] py-1 transition-all duration-150 ${
                isLinkActive("/profile") ? "text-white font-black scale-105" : "opacity-70"
              }`}
            >
              <span className="text-base">👤</span>
              <span>Պրոֆիլ</span>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
