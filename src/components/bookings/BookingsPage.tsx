"use client"

import { useState } from "react"

const MOCK_MY_BOOKINGS = [
  { id: "B-8831", title: "Անգլերենի դասընթաց", provider: "Աննա Հ.", phone: "+374 94 112233", date: "28.09.2026", time: "19:00", price: "5,000 ֏", type: "Zoom", payment: "💳", status: "Հաստատված" },
  { id: "B-9021", title: "Մեքենայի քիմմաքրում", provider: "AutoShine", phone: "+374 77 445566", date: "02.10.2026", time: "11:00", price: "25,000 ֏", type: "Տեղում", payment: "💵", status: "Սպասման մեջ" }
]

const MOCK_RECEIVED_ORDERS = [
  { id: "O-4412", title: "UI/UX Դիզայն", customer: "Արմեն Գ.", phone: "+374 55 998877", date: "30.09.2026", time: "14:00", price: "80,000 ֏", type: "Օնլայն", payment: "💳", status: "Ընթացքում" }
]

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"my" | "received">("my")
  const [myBookings, setMyBookings] = useState(MOCK_MY_BOOKINGS)
  const [receivedOrders, setReceivedOrders] = useState(MOCK_RECEIVED_ORDERS)

  const getStatusColor = (status: string) => {
    if (status === "Հաստատված" || status === "Ավարտված") return "text-emerald-600 bg-emerald-50"
    if (status === "Ընթացքում") return "text-blue-600 bg-blue-50"
    if (status === "Սպասման մեջ") return "text-amber-600 bg-amber-50"
    return "text-rose-600 bg-rose-50"
  }

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id)
    alert(`ID #${id} պատճենվեց`)
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 sm:p-6 font-sans text-slate-800 antialiased selection:bg-emerald-100">
      <div className="mx-auto max-w-4xl bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
        
        {/* Վերնագիր և Մինի Ստատիստիկա */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Պատվերներ</h1>
            <p className="text-[11px] text-slate-400 font-medium">Ակտիվ հայտերի կառավարում</p>
          </div>
          <div className="text-right bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600">
            Շրջանառություն՝ <span className="text-emerald-600 font-black">110,000 ֏</span>
          </div>
        </div>

        {/* Տաբեր */}
        <div className="flex border-b border-slate-100 mb-4 gap-2">
          <button onClick={() => setActiveTab("my")} className={`pb-2 px-3 text-xs font-bold ${activeTab === "my" ? "text-emerald-600 border-b-2 border-emerald-500 font-extrabold" : "text-slate-400"}`}>
            Իմ ամրագրումները ({myBookings.length})
          </button>
          <button onClick={() => setActiveTab("received")} className={`pb-2 px-3 text-xs font-bold ${activeTab === "received" ? "text-emerald-600 border-b-2 border-emerald-500 font-extrabold" : "text-slate-400"}`}>
            Ստացված պատվերներ ({receivedOrders.length})
          </button>
        </div>

        {/* ԱՂՅՈՒՍԱԿԻ ՑՈՒՑԱԿ (Compact List) */}
        <div className="flex flex-col gap-2">
          
          {/* ՏԱԲ 1: ԻՄ ԱՄՐԱԳՐՈՒՄՆԵՐԸ */}
          {activeTab === "my" && myBookings.map((b) => (
            <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/40 hover:bg-slate-50 gap-3 text-xs font-medium">
              <div className="flex items-start sm:items-center gap-3 flex-1">
                <span onClick={() => copyId(b.id)} className="font-mono text-[10px] text-slate-400 bg-white border px-1.5 py-0.5 rounded cursor-pointer hover:bg-slate-100 transition-colors">#{b.id}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 flex-1">
                  <div>
                    <h3 className="font-bold text-slate-900">{b.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{b.provider} ({b.phone})</p>
                  </div>
                  <div className="text-slate-500 text-[11px] sm:text-slate-600 flex items-center gap-2 mt-1 sm:mt-0">
                    <span>📅 {b.date}</span>
                    <span>⏰ {b.time}</span>
                    <span className="bg-white border px-1.5 py-0.5 rounded text-[10px]">{b.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100/60">
                <div className="text-left sm:text-right font-bold text-slate-900">{b.price} <span className="text-[10px] text-slate-400 font-normal">{b.payment}</span></div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusColor(b.status)}`}>{b.status}</span>
              </div>
            </div>
          ))}

          {/* ՏԱԲ 2: ՍՏԱՑՎԱԾ ՊԱՏՎԵՐՆԵՐԸ */}
          {activeTab === "received" && receivedOrders.map((order) => (
            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/40 hover:bg-slate-50 gap-3 text-xs font-medium">
              <div className="flex items-start sm:items-center gap-3 flex-1">
                <span onClick={() => copyId(order.id)} className="font-mono text-[10px] text-slate-400 bg-white border px-1.5 py-0.5 rounded cursor-pointer hover:bg-slate-100">#{order.id}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 flex-1">
                  <div>
                    <h3 className="font-bold text-slate-900">{order.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{order.customer} ({order.phone})</p>
                  </div>
                  <div className="text-slate-500 text-[11px] sm:text-slate-600 flex items-center gap-2 mt-1 sm:mt-0">
                    <span>📅 {order.date}</span>
                    <span>⏰ {order.time}</span>
                    <span className="bg-white border px-1.5 py-0.5 rounded text-[10px]">{order.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100/60 min-w-[140px]">
                <div className="font-bold text-slate-900">{order.price} <span className="text-[10px] font-normal">{order.payment}</span></div>
                {order.status === "Ընթացքում" ? (
                  <button onClick={() => setReceivedOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: "Ավարտված" } : o))} className="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all active:scale-95">Ավարտել</button>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusColor(order.status)}`}>{order.status}</span>
                )}
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  )
}
