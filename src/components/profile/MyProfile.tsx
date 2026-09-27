"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// 🎯 ՆԵՐՄՈՒԾՈՒՄ ԵՆՔ EDITOUTLINED ԻԿՈՆԱՆ
import { 
  DeleteOutlined, 
  EditOutlined,
  CalendarOutlined, 
  MessageOutlined, 
  AppstoreOutlined,
  ExclamationCircleOutlined 
} from "@ant-design/icons";

type User = {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
};

interface Service {
  _id: string;
  title: string;
  price: string;
  category: string;
  subCategory?: string;
  location?: string; // 🎯 Տարածքի դաշտը
  status: string;
  description: string;
}

interface MiniChat {
  _id: string;
  lastMessage: string;
  otherUser: {
    name?: string;
    firstName?: string;
    lastName?: string;
  };
}

// 🎯 ՀԱՅԱՍՏԱՆԻ ԲՆԱԿԱՎԱՅՐԵՐԻ ՄԱՏՐԻՑԱՆ ԽՄԲԱԳՐՄԱՆ ՄՈԴԱԼԻ ՀԱՄԱՐ
const ARMENIA_LOCATIONS_DATA: Record<string, string[]> = {
  "Երևան": ["Աջափնյակ", "Արաբկիր", "Ավան", "Դավթաշեն", "Էրեբունի", "Կենտրոն", "Մալաթիա-Սեբաստիա", "Նոր Նորք", "Նորք-Մարաշ", "Նուբարաշեն", "Շենգավիթ", "Քանաքեռ-Զեյթուն"],
  "Արագածոտն": ["Աշտարակ", "Ապարան", "Թալին", "Ծաղկահովիտ"],
  "Արարատ": ["Արտաշատ", "Արարատ", "Մասիս", "Վեդի"],
  "Արմավիր": ["Արմավիր քաղաք", "Վաղարշապատ (Էջմիածին)", "Մեծամոր"],
  "Գեղարքունիք": ["Գավառ", "Սևան", "Մարտունի", "Վարդենիս", "Ճամբարակ"],
  "Լոռի": ["Վանաձոր", "Ալավերդի", "Սպիտակ", "Ստեփանավան", "Տաշիր"],
  "Կոտայք": ["Հրազդան", "Աբովյան", "Չարենցավան", "Ծաղկաձոր", "Եղվարդ", "Նոր Հաճն", "Բյուրեղավան"],
  "Շիրակ": ["Գյումրի", "Արթիկ", "Մարալիկ", "Ամասիա"],
  "Սյունիք": ["Կապան", "Գորիս", "Սիսիան", "Մեղրի", "Քաջարան"],
  "Վայոց Ձոր": ["Եղեգնաձոր", "Ջերմուկ", "Վայք"],
  "Տավուշ": ["Իջևան", "Դիլիջան", "Բերդ", "Նոյեմբերյան"]
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [myChats, setMyChats] = useState<MiniChat[]>([]); 
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("services"); 

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null); 

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState<string | null>(null);

  // 🎯 🔒 ՀԱՅՏԱՐԱՐՈՒԹՅԱՆ ԽՄԲԱԳՐՄԱՆ (EDIT SERVICE) ՆՈՐ ՍԹԵՅԹԵՐԸ
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const getProfileAndData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile");

      if (!res.ok) {
        window.location.replace("/login");
        return;
      }

      const data = await res.json();
      setUser(data);
      setMyServices(data.myServices || []);
      
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      
      const cleanPhone = data.phone ? data.phone.replace("+374", "").trim() : "";
      setPhone(cleanPhone);

      const chatsRes = await fetch("/api/messages");
      if (chatsRes.ok) {
        const chatsData = await chatsRes.json();
        setMyChats(chatsData.slice(0, 5)); 
      }
    } catch (err) {
      console.error("Տվյալների բեռնման սխալ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileAndData();
  }, []);

  // 🎯 ԿՈՃԱԿԻՆ ՍԵՂՄԵԼԻՍ ՀԻՆ ՏՎՅԱԼՆԵՐԸ ԼՑՆՈՒՄ ԵՆՔ ԽՄԲԱԳՐՄԱՆ ԴԱՇՏԵՐԻ ՄԵՋ
  const handleEditClick = (service: Service) => {
    setEditingServiceId(service._id);
    setEditTitle(service.title);
    // Հանում ենք ֏ նշանը, որպեսզի input-ի մեջ միայն թիվը մնա
    setEditPrice(service.price.replace(" ֏", "").trim());
    setEditLocation(service.location || "Կենտրոն (Երևան)");
    setEditDescription(service.description);
    setShowEditModal(true); // Բացում ենք խմբագրման Popup-ը
  };

  // 🎯 ԻՐԱԿԱՆ ԹԱՐՄԱՑՄԱՆ (PUT) ՖՈՒՆԿՑԻԱՆ ԲԱԶԱՅԻ ՀԱՄԱՐ
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceId || !editTitle || !editPrice || !editDescription) return;

    try {
      setEditLoading(true);
      const formattedPrice = editPrice.includes("֏") ? editPrice : `${editPrice} ֏`;

      // 🔄 Կանչում ենք ծառայությունների API-ն PUT մեթոդով
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: editingServiceId,
          title: editTitle,
          price: formattedPrice,
          location: editLocation,
          description: editDescription,
        }),
      });

      if (res.ok) {
        alert("Հայտարարությունը հաջողությամբ թարմացվեց։");
        setMyServices((prev) =>
          prev.map((s) =>
            s._id === editingServiceId
              ? { ...s, title: editTitle, price: formattedPrice, location: editLocation, description: editDescription }
              : s
          )
        );
        setShowEditModal(false);
      } else {
        // 🎯 ✅ ՈՒՂՂՎԱԾ. Անվտանգ ստուգում, որ դատարկ JSON-ի դեպքում կայքը չկոտրվի
        let errorMessage = "Չհաջողվեց թարմացնել հայտարարությունը";
        try {
          const errData = await res.json();
          errorMessage = errData.error || errorMessage;
        } catch {
          // Եթե բեքենդի պատասխանը դատարկ է, ուղղակի անցնում ենք առաջ
        }
        alert(errorMessage);
        setShowEditModal(false); // Բոլոր դեպքերում փակում ենք մոդալը
      }
    } catch (err) {
      console.error(err);
      alert("Կապի սերվերային սխալ");
    } finally {
      setEditLoading(false);
    }
  };

  const confirmDeleteService = async () => {
    if (!serviceIdToDelete) return;
    try {
      setDeleteLoadingId(serviceIdToDelete);
      const res = await fetch("/api/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: serviceIdToDelete }),
      });
      if (res.ok) {
        setMyServices((prev) => prev.filter((s) => s._id !== serviceIdToDelete));
        setShowDeleteConfirm(false); 
        setServiceIdToDelete(null);
      } else {
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleDeleteServiceClick = (serviceId: string) => {
    setServiceIdToDelete(serviceId);
    setShowDeleteConfirm(true); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const fullPhone = `+374${phone}`;
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone: fullPhone }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setUser(data.user);
      setMyServices(data.user.myServices || []);
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
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

  const registrationDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('hy-AM', { year: 'numeric', month: 'long' })
    : "2026թ. Սեպտեմբեր";

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 lg:px-8 py-24 font-sans text-slate-800 antialiased relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* ՁԱԽ ՍՅՈՒՆ */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-[32px] p-6 border border-slate-200/40 shadow-2xl transition-all">
            <div className="flex flex-col items-center text-center border-b border-slate-100 pb-6">
              <div className="w-16 h-16 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-xl font-black mb-4 shadow-lg select-none">
                {firstName ? firstName.charAt(0) : "U"}{lastName ? lastName.charAt(0) : ""}
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {firstName || user.username} {lastName || ""}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Մասնագետ / Գործընկեր</p>
            </div>

            <div className="grid grid-cols-2 gap-2 py-4 border-b border-slate-100 bg-slate-50/50 rounded-2xl px-3 mt-4 text-center">
              <div className="border-r border-slate-200/60">
                <span className="block text-[18px] font-black text-slate-950 font-mono">{myServices.length}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Ծառայություններ</span>
              </div>
              <div>
                <span className="block text-[18px] font-black text-slate-950 font-mono">{myChats.length}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Ակտիվ Չաթեր</span>
              </div>
            </div>

            {!isEditingProfile ? (
              <div className="flex flex-col gap-4 pt-4">
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
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pt-1">
                  <CalendarOutlined className="text-slate-400" />
                  <span>Հարթակում է՝ {registrationDate}</span>
                </div>
                <button onClick={() => setIsEditingProfile(true)} className="w-full mt-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition-all active:scale-[0.98] shadow-md uppercase tracking-wider">
                  Խմբագրել պրոֆիլը
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-4">
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
                  <button type="submit" disabled={actionLoading} className="w-1/2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50">
                    {actionLoading ? "..." : "Պահպանել"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
                {/* ==========================================
           ԱՋ ՍՅՈՒՆ՝ Աշխատանքային Գրասենյակ (Dashboard)
        ========================================== */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/40 shadow-2xl">
            
            {/* 🎯 ՏԱԲԵՐԻ ՀԱՄԱԿԱՐԳԸ (ԽԵԼԱՑԻ ԿՈՃԱԿՆԵՐ) */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("services")}
                className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
                  activeTab === "services"
                    ? "bg-slate-950 text-white shadow-md scale-105"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <AppstoreOutlined /> Իմ ծառայությունները
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("messages")}
                className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 ${
                  activeTab === "messages"
                    ? "bg-slate-950 text-white shadow-md scale-105"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <MessageOutlined /> Վերջին նամակները
              </button>
            </div>

            {/* 💼 ՏԱԲ 1. ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆՆԵՐԻ ՑՈՒՑԱԿԸ */}
            {activeTab === "services" && (
              myServices.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {myServices.map((service) => (
                    <div key={service._id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/40 hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 group">
                                          <div className="flex-1">
                        <div className="flex flex-col gap-1.5 w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border truncate max-w-[180px]">{service.category}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{service.status || "Ակտիվ"}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {service.subCategory && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/40 border border-indigo-100 px-2 py-0.5 rounded-md self-start truncate max-w-[150px]">📍 {service.subCategory}</span>}
                            {service.location && <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md font-sans truncate max-w-[150px]">🏢 {service.location.split(" (")}</span>}
                          </div>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-2">{service.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed line-clamp-2">{service.description}</p>
                        <div className="mt-3 text-base font-black text-slate-900 font-mono">{service.price}</div>
                      </div>

                      <div className="flex sm:flex-col gap-2 justify-end sm:w-24 pt-1">
                        <Link href={`/services/${service._id}`} className="flex-1 sm:w-full py-2 text-[10px] text-center font-bold text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm transition-all hover:bg-slate-50 active:scale-95">Դիտել</Link>
                        
                        <div className="flex gap-1.5 sm:flex-row w-full">
                          {/* 🎯 ✅ ՆՈՐ ԽՄԲԱԳՐԵԼՈՒ ՄԱՏԻՏ ԿՈՃԱԿԸ (Բացում է Խմբագրման Popup-ը) */}
                          <button type="button" onClick={() => handleEditClick(service)} className="flex-1 py-2 text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-100 rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center text-xs">
                            <EditOutlined />
                          </button>
                          
                          <button type="button" disabled={deleteLoadingId === service._id} onClick={() => handleDeleteServiceClick(service._id)} className="flex-1 py-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-100 rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center text-xs">
                            <DeleteOutlined />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-sm font-bold text-slate-400">Դուք դեռ ոչ մի հայտարարություն չեք ավելացրել։</p>
                  <Link href="/services" className="inline-block mt-4 text-xs font-bold text-slate-900 underline underline-offset-4 hover:text-slate-700">Գնալ ծառայությունների էջ և ստեղծել նորը →</Link>
                </div>
              )
            )}

            {/* 💬 ՏԱԲ 2. ՄԻՆԻ-ՉԱԹԵՐԻ ՑՈՒՑԱԿԸ */}
            {activeTab === "messages" && (
              myChats.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {myChats.map((chat) => {
                    const chatName = chat.otherUser.name || (chat.otherUser.firstName ? `${chat.otherUser.firstName} ${chat.otherUser.lastName || ""}` : "Օգտատեր");
                    return (
                      <Link key={chat._id} href="/messages" className="p-4 border border-slate-100 rounded-xl bg-slate-50/60 hover:bg-slate-100/80 transition-all flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 bg-slate-950 text-white rounded-lg flex items-center justify-center text-xs font-black shrink-0">{chatName.charAt(0).toUpperCase()}</div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-slate-900 truncate">{chatName}</h4>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">{chat.lastMessage || "Նոր չաթ..."}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md shrink-0 uppercase tracking-wider">Խոսել →</span>
                      </Link>
                    );
                  })}
                  <Link href="/messages" className="text-center text-xs font-bold text-slate-500 hover:text-slate-900 mt-2 block underline">Տեսնել բոլոր նամակագրությունները →</Link>
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">💬 Ձեր էջում դեռ ոչ մի ակտիվ նամակագրություն չկա։</div>
              )
            )}
          </div>
        </div>
      </div>
      {/* ========================================================
         ✨ 🔒 ՆՈՐ ՊՐԵՄԻՈՒՄ ՋՆՋՄԱՆ CUSTOM ՄՈԴԱԼ ՊԱՏՈՒՀԱՆ (POPUP)
      ======================================================== */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => { if (deleteLoadingId === null) setShowDeleteConfirm(false); }} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity" />
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 max-w-sm w-full shadow-2xl relative z-10 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4 border border-rose-100 shadow-sm">
              <ExclamationCircleOutlined />
            </div>
            <h3 className="text-base font-black text-slate-950 tracking-tight">Հաստատե՞լ ջնջումը</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed px-2">Վստա՞հ եք, որ ուզում եք ընդմիշտ ջնջել այս հայտարարությունը։ Այս գործողությունը անդառնալի է։</p>
            <div className="flex items-center gap-3 mt-6">
              <button type="button" disabled={deleteLoadingId !== null} onClick={() => { setShowDeleteConfirm(false); setServiceIdToDelete(null); }} className="w-1/2 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200/60 rounded-xl transition-all active:scale-95">Չեղարկել</button>
              <button type="button" disabled={deleteLoadingId !== null} onClick={confirmDeleteService} className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-md uppercase tracking-wider active:scale-95 disabled:opacity-40">{deleteLoadingId !== null ? "..." : "Ջնջել"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
         ✨ 🔒 ՆՈՐ ՊՐԵՄԻՈՒՄ ՀԱՅՏԱՐԱՐՈՒԹՅԱՆ ԽՄԲԱԳՐՄԱՆ ՄՈԴԱԼ (POPUP)
      ======================================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={() => { if (!editLoading) setShowEditModal(false); }} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity" />

          <div className="bg-white border border-slate-100 rounded-[32px] sm:rounded-[36px] p-5 sm:p-8 max-w-lg w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10 my-auto">
            <button type="button" onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 font-bold text-sm h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center transition-colors">✕</button>

            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight font-sans">Խմբագրել Հայտարարությունը</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium font-sans">Փոխեք ձեր ծառայության տվյալները և սեղմեք պահպանել</p>
            </div>

            <form onSubmit={handleUpdateService} className="space-y-4">
              {/* Վերնագիր */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Ծառայության անվանումը</label>
                <input type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full border border-slate-200 px-3.5 py-2.5 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 transition-all font-sans" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Գին */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Արժեքը (֏)</label>
                  <input 
                    type="text" 
                    required 
                    value={editPrice} 
                    onChange={(e) => setEditPrice(e.target.value)} 
                    className="w-full border border-slate-200 px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 transition-all" 
                  />
                </div>

                {/* 🎯 ԽԵԼԱՑԻ ՄԻԱՍՆԱԿԱՆ ԲՆԱԿԱՎԱՅՐԻ SELECT ԴԱՇՏԸ ԽՄԲԱԳՐՄԱՆ ՀԱՄԱՐ */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Տարածքը / Քաղաքը</label>
                  <select
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full border border-slate-200 px-3 py-2.5 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 transition-all cursor-pointer font-sans"
                  >
                    {Object.keys(ARMENIA_LOCATIONS_DATA).map((marz) => (
                      <optgroup key={marz} label={marz} className="text-slate-400 font-bold bg-slate-50">
                        {ARMENIA_LOCATIONS_DATA[marz].map((city) => (
                          <option key={city} value={`${city} (${marz})`} className="text-slate-900 font-medium">
                            {city}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Նկարագրություն */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Մանրամասն Նկարագրություն</label>
                <textarea 
                  required 
                  rows={4}
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  className="w-full border border-slate-200 px-3.5 py-2.5 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 resize-none transition-all leading-relaxed font-sans" 
                />
              </div>

              {/* Գործողություններ */}
              <div className="flex items-center gap-3 mt-4 pt-2">
                <button 
                  type="button" 
                  disabled={editLoading}
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 py-3 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-all font-sans"
                >
                  Չեղարկել
                </button>
                <button 
                  type="submit" 
                  disabled={editLoading}
                  className="w-1/2 bg-slate-900 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md uppercase tracking-wider disabled:opacity-50 font-sans"
                >
                  {editLoading ? "..." : "Պահպանել"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
