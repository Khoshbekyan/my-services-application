"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BookingItem {
  _id: string;
  status: string;
  createdAt: string;
  serviceId: {
    _id: string;
    title: string;
    price: string;
    category: string;
    description: string;
  } | null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyBookings() {
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error("Պատվերների բեռնման սխալ:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyBookings();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center font-sans text-white text-xs uppercase tracking-widest animate-pulse">
        Պատվերները բեռնվում են...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 lg:px-8 py-12 pb-28 md:pb-24 text-white font-sans antialiased">
      <div className="max-w-4xl mx-auto">
        
        <div className="border-b border-slate-900 pb-5 mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Իմ Ամրագրումները</h1>
          <p className="text-xs text-slate-400 mt-1">Այստեղ երևում են ձեր կողմից պատվիրված բոլոր ակտիվ ծառայությունները</p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((item) => {
              if (!item.serviceId) return null; // Եթե ծառայությունը ջնջվել է
              return (
                <div key={item._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-bold uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {item.serviceId.category}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                        item.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {item.status === "Pending" ? "Սպասման մեջ" : "Հաստատված"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{item.serviceId.title}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">Պատվերի ամսաթիվ՝ {new Date(item.createdAt).toLocaleDateString('hy-AM')}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                    <div className="text-base sm:text-lg font-black text-emerald-400 font-mono">{item.serviceId.price}</div>
                    <Link href={`/services/${item.serviceId._id}`} className="px-4 py-2 bg-white text-slate-950 hover:bg-emerald-500 hover:text-white transition-all text-[11px] font-black uppercase rounded-xl">
                      Դիտել
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
            <p className="text-sm font-bold text-slate-400">Դուք դեռևս ոչ մի ծառայություն չեք ամրագրել։</p>
            <Link href="/services" className="inline-block mt-4 text-xs font-bold bg-white text-slate-950 px-4 py-2 rounded-xl">
              Բացահայտել Ծառայությունները
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
