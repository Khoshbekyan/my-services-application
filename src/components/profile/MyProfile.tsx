"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Տվյալների տիպերի սահմանում
type User = {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

interface Service {
  _id: string;
  title: string;
  price: string;
  category: string;
  status: string;
  description: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [myServices, setMyServices] = useState<Service[]>([]); // Միայն տվյալ օգտատիրոջ հայտարարությունները
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        // Կանչում ենք թարմացված ռոուտը
        const res = await fetch("/api/profile");

        if (!res.ok) {
          console.log("User not authenticated");
          window.location.replace("/login");
          return;
        }

        const data = await res.json();
        
        // Բաժանում ենք օգտատիրոջ տվյալները և իր հայտարարությունները
        setUser(data);
        setMyServices(data.myServices || []); // Բեքենդից եկած ֆիլտրված ցուցակը
        
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        
        // Հեռախոսից հանում ենք +374-ը input-ի համար
        const cleanPhone = data.phone ? data.phone.replace("+374", "").trim() : "";
        setPhone(cleanPhone);
      } catch (err) {
        console.error("Տվյալների բեռնման սխալ:", err);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const fullPhone = `+374${phone}`;

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: fullPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Ինչ-որ սխալ տեղի ունեցավ");
        return;
      }

      // Թարմացնում ենք օգտատիրոջ տվյալները և իր ծառայությունները
      setUser(data.user);
      setMyServices(data.user.myServices || []);
      setIsEditingProfile(false);
      alert("Պրոֆիլը հաջողությամբ թարմացվեց:");
    } catch (err) {
      console.error("Պահպանման սխալ:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-sm font-bold tracking-widest animate-pulse uppercase">Բեռնվում է...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 lg:px-8 py-24 font-sans text-slate-800 antialiased relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* ՁԱԽ ՍՅՈՒՆ՝ Օգտատիրոջ անձնական քարտը */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-[32px] p-6 border border-slate-200/40 shadow-2xl transition-all">
            
            <div className="flex flex-col items-center text-center border-b border-slate-100 pb-6">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black mb-4 shadow-lg select-none">
                {firstName ? firstName.charAt(0) : "U"}{lastName ? lastName.charAt(0) : ""}
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {firstName || user.username} {lastName || ""}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Մասնագետ / Հայտարարատու</p>
            </div>

            {!isEditingProfile ? (
              <div className="flex flex-col gap-4 pt-6">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Օգտանուն</span>
                  <span className="text-sm font-semibold text-slate-700 mt-0.5 block truncate">{user.username}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Էլ. Փոստ</span>
                  <span className="text-sm font-semibold text-slate-700 mt-0.5 block truncate">{user.email}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Հեռախոսահամար</span>
                  <span className="text-sm font-mono font-bold text-slate-700 mt-0.5 block">
                    {phone ? `+374 ${phone}` : "Նշված չէ"}
                  </span>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(true)} 
                  className="w-full mt-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-xl border border-slate-200/60 transition-all active:scale-[0.98]"
                >
                  Խմբագրել պրոֆիլը
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Անուն</label>
                    <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Անուն" className="w-full border border-slate-200 px-3 py-2 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Ազգանուն</label>
                    <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Ազգանուն" className="w-full border border-slate-200 px-3 py-2 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Հեռախոս</label>
                  <div className="relative w-full flex items-center overflow-hidden border border-slate-200 rounded-xl bg-slate-50/50 focus-within:border-slate-900 transition-all">
                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500 bg-slate-100 h-9 px-3 border-r border-slate-200 select-none">
                      <span>🇦🇲</span>
                      <span>+374</span>
                    </div>
                    <input type="tel" required maxLength={8} value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} placeholder="000000" className="w-full h-9 px-3 text-xs font-mono font-bold outline-none bg-transparent" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button type="button" disabled={actionLoading} onClick={() => setIsEditingProfile(false)} className="w-1/2 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl">Չեղարկել</button>
                  <button type="submit" disabled={actionLoading} className="w-1/2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50">
                    {actionLoading ? "..." : "Պահպանել"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        {/* ==========================================
           ԱՋ ՍՅՈՒՆ՝ Իմ հայտարարությունների բաժինը
        ========================================== */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/40 shadow-2xl">
            
            {/* Վերնագիր և քանակի տեղեկատվություն */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Իմ հայտարարությունները</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Ձեր կողմից ավելացված ակտիվ ծառայությունների ցանկը</p>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-100 select-none">
                {myServices.length} հայտարարություն
              </div>
            </div>

            {/* Հայտարարությունների դինամիկ ցուցակ */}
            {myServices.length > 0 ? (
              <div className="flex flex-col gap-4">
                {myServices.map((service) => (
                  <div key={service._id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/40 hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border">{service.category}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{service.status}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-2">{service.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed line-clamp-2">{service.description}</p>
                      <div className="mt-3 text-base font-black text-slate-900">{service.price}</div>
                    </div>

                    {/* Գործողությունների կոճակներ */}
                    <div className="flex sm:flex-col gap-1.5 justify-end sm:w-24 pt-1">
                      <Link href={`/services/${service._id}`} className="flex-1 sm:w-full py-2 text-[10px] text-center font-bold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm transition-all hover:bg-slate-50 active:scale-95">
                        Տեսնել
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Եթե տվյալ օգտատերը դեռ ոչ մի հայտարարություն չի ավելացրել */
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl">
                <p className="text-sm font-bold text-slate-400">Դուք դեռ ոչ մի հայտարարություն չեք ավելացրել։</p>
                <Link href="/services" className="inline-block mt-4 text-xs font-bold text-slate-900 underline underline-offset-4 hover:text-slate-700">
                  Գնալ ծառայությունների էջ և ստեղծել նորը →
                </Link>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
