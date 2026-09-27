"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import NotificationBell from "@/src/components/Notification"; // 🎯 Քո Ant Design զանգակը

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <header className="w-full h-20 bg-slate-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50">
        <div className="text-sm font-black text-white tracking-widest uppercase font-sans">Servify</div>
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </header>
    );
  }

  return (
    <header className="w-full h-20 bg-slate-950/70 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50 select-none shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      
      {/* 🏡 ԼՈԳՈ */}
      <Link href="/" className="text-lg font-black text-white tracking-widest uppercase hover:opacity-80 transition-all font-sans">
        Servify
      </Link>

      {/* 🔗 ՆԱՎԻԳԱՑԻԱ ԵՎ ԿՈՃԱԿՆԵՐ */}
      <nav className="flex items-center gap-2 sm:gap-4">
        <Link href="/services" className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider font-sans px-3 py-2 rounded-xl hover:bg-white/5">
          Ծառայություններ
        </Link>

        {isAuthenticated ? (
          /* 👤 ԼՈԳԻՆ ԵՂԱԾ ՕԳՏԱՏԻՐՈՋ UI (PREMIUM STYLE) */
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* 💬 ՆԱՄԱԿՆԵՐ */}
            <Link 
              href="/messages" 
              className="w-10 h-10 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center text-base active:scale-95 border border-transparent hover:border-white/5"
              title="Նամակներ"
            >
              <MessageOutlined />
            </Link>

            {/* 🔔 ԾԱՆՈՒՑՈՒՄՆԵՐ (ԶԱՆԳԱԿ) */}
            <div className="w-10 h-10 flex items-center justify-center">
              <NotificationBell />
            </div>

            {/* 👤 ԻՄ ՊՐՈՖԻԼԸ */}
            <Link 
              href="/profile" 
              className="w-10 h-10 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center text-base active:scale-95 border border-transparent hover:border-white/5"
              title="Իմ Պրոֆիլը"
            >
              <UserOutlined />
            </Link>

            {/* 🚪 «ԵԼՔ» ՇՔԵՂ ԿՈՃԱԿԸ (ՄԻԱՅՆ ԻԿՈՆԱ՝ ՄՈԲԱՅԼՈՒՄ, ՏԵՔՍՏ՝ PC-ՈՒՄ) */}
            <button 
              onClick={handleLogout}
              className="h-10 px-3 sm:px-4 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2 text-xs font-black uppercase tracking-wider font-sans ml-2"
              title="Ելք համակարգից"
            >
              <LogoutOutlined className="text-sm" />
              <span className="hidden sm:inline">Ելք</span>
            </button>
          </div>
        ) : (
          /* 🇦🇲 ԱՆՑՈՐԴԻ (ՀՅՈՒՐԻ) UI */
          <div className="flex items-center gap-2 pl-2">
            <Link 
              href="/login" 
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider font-sans px-3 py-2.5 rounded-xl hover:bg-white/5"
            >
              Մուտք
            </Link>
            <Link 
              href="/register" 
              className="text-xs font-black bg-white hover:bg-slate-200 text-slate-950 uppercase tracking-wider font-sans px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Գրանցվել
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
