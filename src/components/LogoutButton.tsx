"use client"

// 🎯 ՈՒՂՂՎԱԾ «ԵԼՔ» ՖՈՒՆԿՑԻԱՆ. Ակնթարթորեն մաքրում է քեշը և տանում գլխավոր էջ
  const handleLogout = async () => {
    try {
      // 1. Կանչում ենք բեքենդի ելքի API-ն, որ cookie-ն ջնջվի
      const res = await fetch("/api/logout", { method: "POST" });
      
      if (res.ok) {
        // 2. 🚀 ԱՄԵՆԱԿԱՐԵՎՈՐ ՔԱՅԼԸ. Տանում ենք գլխավոր էջ ու ստիպում բրաուզերին 
        // լիարժեք reload անել էջը, ինչը 100%-ով թարմացնում է Header-ը առանց քեշի խնդրի
        window.location.href = "/";
      } else {
        alert("Չհաջողվեց դուրս գալ համակարգից");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

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
