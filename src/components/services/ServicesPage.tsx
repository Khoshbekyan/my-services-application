"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Service {
  _id: string;
  title: string;
  price: string;
  category: string;
  status: string;
  description: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export default function ServicesPage() {
  // Ծառայությունների հիմնական և ֆիլտրվող սթեյթերը
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Ռեակտիվ Live Ֆիլտրերի սթեյթերը
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Բոլորը");
  const [sortBy, setSortBy] = useState("newest");

  // 🔒 ՄՈԴԱԼԻ ԵՎ ՆՈՐ ՀԱՅՏԱՐԱՐՈՒԹՅԱՆ ՍԹԵՅԹԵՐԸ
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("Վերանորոգում");
  const [newDescription, setNewDescription] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Տվյալների սկզբնական բեռնում
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      const servicesRes = await fetch("/api/services");
      if (servicesRes.ok) {
        const data: Service[] = await servicesRes.json();
        setServices(data);
        setFilteredServices(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // ⚡ ՆՈՐ ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆ ԱՎԵԼԱՑՆԵԼՈՒ (POST) ՖՈՒՆԿՑԻԱՆ
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newDescription) {
      alert("Խնդրում ենք լրացնել բոլոր դաշտերը");
      return;
    }

    try {
      setCreateLoading(true);
      // Ֆորմատավորում ենք գինը ավտոմատ " ֏" նշանով, եթե չկա
      const formattedPrice = newPrice.includes("֏") ? newPrice : `${newPrice} ֏`;

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          price: formattedPrice,
          category: newServiceCategory,
          description: newDescription,
        }),
      });

      if (res.ok) {
        // Մաքրում ենք ֆորման ու փակում մոդալը
        setNewTitle("");
        setNewPrice("");
        setNewDescription("");
        setShowCreateModal(false);
        alert("Հայտարարությունը հաջողությամբ ավելացվեց։");
        // Live թարմացնում ենք էկրանի տվյալները բազայից
        loadInitialData();
      } else {
        const errData = await res.json();
        alert(errData.error || "Չհաջողվեց ավելացնել ծառայությունը");
      }
    } catch (err) {
      console.error(err);
      alert("Սերվերի հետ կապի սխալ");
    } finally {
      setCreateLoading(false);
    }
  };
  // Live Ֆիլտրացիայի տրամաբանություն
  useEffect(() => {
    let result = [...services];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "Բոլորը") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    if (sortBy === "newest") {
      result.sort((a, b) => b._id.localeCompare(a._id));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => a._id.localeCompare(b._id));
    }

    setFilteredServices(result);
  }, [searchQuery, selectedCategory, sortBy, services]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-sm font-bold tracking-widest animate-pulse uppercase">Բեռնվում է...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 lg:px-8 py-24 font-sans text-slate-800 antialiased relative overflow-hidden">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Գլխամաս և Կոճակի խելացի տրիգեր */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-900 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Ծառայություններ</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Գտեք և ամրագրեք լավագույն մասնագետներին ակնթարթորեն</p>
          </div>
          
          {/* ⚡ Եթե լոգին է՝ բացում է մոդալը, եթե լոգին չէ՝ տանում է լոգին էջ */}
          {isAuthenticated ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center px-5 py-3 bg-white hover:bg-emerald-500 hover:text-white text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all active:scale-[0.98]"
            >
              + Ավելացնել Հայտարարություն
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-3 bg-white hover:bg-emerald-500 hover:text-white text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all active:scale-[0.98]"
            >
              Մուտք գործել՝ հայտարարություն ավելացնելու համար
            </Link>
          )}
        </div>

        {/* 🔍 ՖԻԼՏՐԵՐԻ ԲԼՈԿ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
          <input
            type="text"
            placeholder="Որոնել ծառայություն..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all cursor-pointer"
          >
            <option value="Բոլորը">Բոլոր Կատեգորիաները</option>
            <option value="Վերանորոգում">Վերանորոգում</option>
            <option value="Դիզայն">Դիզայն</option>
            <option value="ՏՏ / Ծրագրավորում">ՏՏ / Ծրագրավորում</option>
            <option value="Գեղեցկություն">Գեղեցկություն</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all cursor-pointer"
          >
            <option value="newest">Նորագույն հայտարարություններ</option>
            <option value="oldest">Հնագույն հայտարարություններ</option>
          </select>
        </div>

        {/* ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆՆԵՐԻ ՑՈՒՑԱԿ */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service._id} className="bg-white rounded-[32px] p-6 border border-slate-200/40 shadow-2xl transition-all duration-300 hover:translate-y-[-4px] flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4 select-none">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border">
                      {service.category}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      {service.status || "Նոր"}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 tracking-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="text-xl font-black text-slate-950 font-mono">
                    {service.price}
                  </div>
                  
                  <Link 
                    href={`/services/${service._id}`}
                    className="px-4 py-2.5 bg-slate-950 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    Մանրամասն &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md border border-dashed border-white/10 rounded-[32px]">
            <p className="text-sm font-bold text-slate-400">Ոչ մի համապատասխան ծառայություն չգտնվեց։</p>
          </div>
        )}
        {/* ==========================================
           🔒 ՊՐԵՄԻՈՒՄ ԱՎԵԼԱՑՄԱՆ ՄՈԴԱԼ ՊԱՏՈՒՀԱՆ (CREATE LISTING MODAL)
        ========================================== */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Մութ թափանցիկ ետնաֆոն (Blur Overlay) */}
            <div 
              onClick={() => setShowCreateModal(false)} 
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity" 
            />

            {/* Ֆորմայի մաքուր սպիտակ կոնտրաստային քարտը */}
            <div className="bg-white border border-slate-100 rounded-[36px] p-6 sm:p-8 max-w-lg w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10 animate-fade-in">
              
              {/* Փակելու կոճակ */}
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-950 font-bold text-sm h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              {/* Մոդալի վերնագիր */}
              <div className="border-b border-slate-100 pb-4 mb-5">
                <h3 className="text-xl font-black text-slate-950 tracking-tight">Ստեղծել Հայտարարություն</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Լրացրեք ձեր ծառայության տվյալները հարթակում հրապարակելու համար</p>
              </div>

              {/* Ավելացման Ֆորմա */}
              <form onSubmit={handleCreateService} className="space-y-4">
                
                {/* Վերնագիր */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ծառայության անվանումը</label>
                  <input 
                    type="text" 
                    required 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    placeholder="Օրինակ՝ Բնակարանների կապիտալ վերանորոգում"
                    className="w-full border border-slate-200 px-3.5 py-2.5 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 transition-all" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Արժեք */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Արժեքը (֏)</label>
                    <input 
                      type="text" 
                      required 
                      value={newPrice} 
                      onChange={(e) => setNewPrice(e.target.value)} 
                      placeholder="Օրինակ՝ 15,000"
                      className="w-full border border-slate-200 px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 transition-all" 
                    />
                  </div>

                  {/* Կատեգորիա */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Կատեգորիա</label>
                    <select
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value)}
                      className="w-full border border-slate-200 px-3 py-2.5 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 transition-all cursor-pointer"
                    >
                      <option value="Վերանորոգում">Վերանորոգում</option>
                      <option value="Դիզայն">Դիզայն</option>
                      <option value="ՏՏ / Ծրագրավորում">ՏՏ / Ծրագրավորում</option>
                      <option value="Գեղեցկություն">Գեղեցկություն</option>
                    </select>
                  </div>
                </div>

                {/* Նկարագրություն */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Մանրամասն Նկարագրություն</label>
                  <textarea 
                    required 
                    rows={4}
                    value={newDescription} 
                    onChange={(e) => setNewDescription(e.target.value)} 
                    placeholder="Նկարագրեք ձեր ծառայությունը, փորձը և պայմանները..."
                    className="w-full border border-slate-200 px-3.5 py-2.5 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 resize-none transition-all leading-relaxed" 
                  />
                </div>

                {/* Գործողությունների կոճակներ */}
                <div className="flex items-center gap-3 mt-4 pt-2">
                  <button 
                    type="button" 
                    disabled={createLoading}
                    onClick={() => setShowCreateModal(false)}
                    className="w-1/2 py-3 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    Չեղարկել
                  </button>
                  <button 
                    type="submit" 
                    disabled={createLoading}
                    className="w-1/2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md uppercase tracking-wider disabled:opacity-50"
                  >
                    {createLoading ? "Ավելացվում է..." : "Հրապարակել"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
