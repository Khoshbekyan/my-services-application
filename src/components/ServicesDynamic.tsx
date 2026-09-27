"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ServiceUser {
  _id: string;
  name: string;
  phone?: string;
}

interface Service {
  _id: string;
  title: string;
  price: string;
  category: string;
  status: string;
  description: string;
  userId?: ServiceUser;
}

interface ServicesDynamicProps {
  id: string;
}

export default function ServicesDynamic({ id }: ServicesDynamicProps) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function initializeServiceDetail() {
      try {
        setLoading(true);

        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }

        const res = await fetch("/api/services");
        if (res.ok) {
          const data: Service[] = await res.json();
          const foundService = data.find((s) => s._id === id);
          setService(foundService || null);
        }
      } catch (err) {
        console.error("Տվյալների բեռնման սխալ:", err);
      } finally {
        setLoading(false);
      }
    }

    initializeServiceDetail();
  }, [id]);

  // ⚡ ԻՐԱԿԱՆ ԱՄՐԱԳՐՄԱՆ (POST) ՖՈՒՆԿՑԻԱՆ
  const handleCreateBooking = async () => {
    if (!service) return;
    try {
      setBookingLoading(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service._id }),
      });

      if (res.ok) {
        alert("Ծառայությունը հաջողությամբ ամրագրվեց:");
        router.push("/bookings"); // 🔄 Ավտոմատ տանում ենք պատվերների էջ
      } else {
        const errData = await res.json();
        alert(errData.error || "Ամրագրումը ձախողվեց");
      }
    } catch (err) {
      console.error(err);
      alert("Կապի ներքին սխալ");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans select-none text-slate-500 text-sm font-semibold">
        <svg className="animate-spin h-6 w-6 text-white mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Բեռնվում են իրական տվյալները...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans select-none text-slate-400 text-sm font-semibold gap-4">
        <p>⚠️ Հայտարարությունը չի գտնվել բազայում։</p>
        <Link href="/services" className="text-xs font-bold text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          Հետ դեպի ծառայություններ
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 lg:px-8 py-12 pb-24 font-sans select-none text-slate-800 antialiased relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-3xl w-full relative z-10">
        <div className="mb-6">
          <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
            ← Հետ դեպի ծառայություններ
          </Link>
        </div>

        <div className="bg-white border border-slate-200/40 rounded-[32px] p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border">
                {service.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                {service.status || "Նոր"}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Հայտարարության ID</span>
              <span className="text-xs font-mono font-bold text-slate-600 block mt-0.5">
                #{service._id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight max-w-xl leading-tight">
              {service.title}
            </h1>
            <div className="sm:text-right bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl min-w-36">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Արժեքը</span>
              <span className="text-xl font-black text-slate-900 block mt-0.5">{service.price}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Ծառայության Նկարագրություն</h3>
            <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50/50 border border-slate-100/50 p-4 rounded-2xl whitespace-pre-line">
              {service.description}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Հայտարարատու մասնագետ</span>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-sm">
                      {service.userId?.name ? service.userId.name.charAt(0) : "✓"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{service.userId?.name || "Համակարգային Հաշիվ"}</h4>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Ակտիվ օգտատեր</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {service.userId?.phone ? (
                    <a href={`tel:${service.userId.phone}`} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-200 text-center shadow-md flex items-center justify-center gap-2">
                      <span>📞</span> Zանգահարել ({service.userId.phone})
                    </a>
                  ) : (
                    <div className="text-center text-xs font-semibold text-slate-400 py-3.5 bg-slate-50 rounded-xl border">🔕 Հեռախոսահամարը նշված չէ</div>
                  )}

                  <button
                    onClick={handleCreateBooking}
                    disabled={bookingLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 text-center shadow-md"
                  >
                    {bookingLoading ? "Ամրագրվում է..." : "📅 Ամրագրել Ծառայությունը"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-6 select-none">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-base shrink-0 shadow-md">🔒</div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight">Կոնտակտային տվյալները պաշտպանված են</h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed max-w-md">
                      Մասնագետի հեռախոսահամարը տեսնելու և առցանց ամրագրում կատարելու համար անհրաժեշտ է մուտք գործել համակարգ։
                    </p>
                  </div>
                </div>
                <Link href="/login" className="w-full sm:w-auto shrink-0 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all text-center shadow-sm uppercase tracking-wider">
                  Մուտք Գործել
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
