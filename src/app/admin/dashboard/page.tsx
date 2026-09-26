// 📄 ՖԱՅԼ: app/admin/dashboard/page.tsx

import AdminHeader from "@/src/components/admin/AdminHeader"
import Link from "next/link"

export default function AdminDashboardPage() {
  // Հետագայում այս թվերը `fetch` կանենք բազայից (User.countDocuments() և Product.countDocuments())
  const stats = {
    totalUsers: 142,
    totalProducts: 36,
    activeSessions: 12
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <div>
        {/* ⚡ Կանչում ենք ադմինի սեփական մենյուն */}
        <AdminHeader />

        <main className="mx-auto max-w-7xl w-full px-6 sm:px-8 py-12">
          
          {/* Welcome Text */}
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
            <p className="text-sm text-slate-400 mt-1">Real-time statistics and main administrative nodes.</p>
          </div>

          {/* 📊 ԳԱԶԱՆ ANALYTICS CARDS (Stats) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Քարտ 1: Users Count */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-sm">👤</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalUsers}</span>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ +12 new registration this week</p>
              </div>
            </div>

            {/* Քարտ 2: Products Count */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Products</span>
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 text-sm">📦</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalProducts}</span>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Listed across 5 active categories</p>
              </div>
            </div>

            {/* Քարտ 3: Active Sessions */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Nodes</span>
                <span className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 text-sm">⚡</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.activeSessions}</span>
                <p className="text-[10px] text-purple-600 font-semibold mt-1 animate-pulse">● System core load is stable</p>
              </div>
            </div>

          </div>

          {/* Quick Actions (Արագ անցման կոճակներ) */}
          <div className="mt-12 bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-slate-900">Need to manage stock?</h3>
              <p className="text-xs text-slate-400 mt-0.5">Quickly navigate to the products catalog to add, edit or remove drops.</p>
            </div>
            <Link 
              href="/admin/products" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-emerald-100 active:scale-95 shrink-0"
            >
              Manage Products &rarr;
            </Link>
          </div>

        </main>
      </div>
    </div>
  )
}
