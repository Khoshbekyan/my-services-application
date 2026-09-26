// 📄 ՖԱՅԼ: components/AdminHeader.tsx

import Link from "next/link"
import { headers } from "next/headers"

export default async function AdminHeader() {
  // Իմանում ենք, թե ադմինը որ էջում է, որ հղումը ակտիվ (Active) ցույց տանք
  const headerList = await headers()
  const activePath = headerList.get("x-invoke-path") || ""
  const isLinkActive = (path: string) => activePath === path

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-slate-900 text-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        
        {/* Admin Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 text-lg font-black shadow-md shadow-emerald-500/20">
            ⚙
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-base font-black tracking-tight text-white">ControlPanel</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase mt-0.5 tracking-widest">Admin Mode</span>
          </div>
        </Link>

        {/* ⚡ ԱԴՄԻՆԻ ՆԱՎԻԳԱՑԻԱՆ */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-semibold text-slate-300">
          
          {/* Dashboard (Stats) */}
          <Link
            href="/admin/dashboard"
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:text-white hover:bg-slate-800 ${
              isLinkActive("/admin/dashboard") ? "text-emerald-400 bg-slate-800 font-bold" : ""
            }`}
          >
            Dashboard
          </Link>

          {/* Users List */}
          <Link
            href="/admin/users"
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:text-white hover:bg-slate-800 ${
              isLinkActive("/admin/users") ? "text-emerald-400 bg-slate-800 font-bold" : ""
            }`}
          >
            Users
          </Link>

          {/* Products Management */}
          <Link
            href="/admin/products"
            className={`px-4 py-2 rounded-xl transition-all duration-200 hover:text-white hover:bg-slate-800 ${
              isLinkActive("/admin/products") ? "text-emerald-400 bg-slate-800 font-bold" : ""
            }`}
          >
            Products
          </Link>

          <span className="w-[1px] h-5 bg-slate-800 mx-2 hidden sm:inline-block" />

          {/* Log Out API Link */}
          <a
            href="/api/logout" 
            className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2 text-xs font-bold text-rose-400 border border-rose-500/20 transition-all duration-200 active:scale-[0.97]"
          >
            Log Out
          </a>
        </nav>

      </div>
    </header>
  )
}
