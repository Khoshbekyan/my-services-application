"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRightOutlined, 
  SearchOutlined, 
  MessageOutlined, 
  CheckCircleOutlined 
} from "@ant-design/icons";

interface Service {
  _id: string;
  title: string;
  price: string;
  category: string;
  subCategory?: string;
  location?: string; // 🎯 Կպահի ընտրված քաղաքը/շրջանը
  status: string;
  description: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

// 🗂️ 1. ԾԱՐԱՅՈՒԹՅՈՒՆՆԵՐԻ ՄԱՏՐԻՑԱՆ
const NEW_CATEGORIES_DATA: Record<string, string[]> = {
  "🏗️ Շինարարություն և Վերանորոգում": [
    "Կահույքի արտադրություն և նորոգում",
    "Պատերի հարդարում և ներկում (Մալյարկա)",
    "Սանտեխնիկա և Ջեռուցում",
    "Էլեկտրականություն և Հոսանքի լարեր",
    "Դռներ, Պատուհաններ և Ապակի",
    "Տանիքների և հիմքերի կառուցում"
  ],
  "💻 ՏՏ, Մեդիա և Դիզայն": [
    "Գրաֆիկ դիզայն և Լոգոների ստեղծում",
    "Ծրագրավորում և Կայքերի պատրաստում (IT)",
    "Վիդեոմոնտաժ և Անիմացիա",
    "3D Մոդելավորում",
    "Տպագրություն և Գովազդային վահանակներ",
    "SMM և Սոցցանցերի էջերի վարում"
  ],
  "🚗 Տրանսպորտ և Ավտոծառայություններ": [
    "Բեռնափոխադրումներ և Պատվերով մեքենաներ",
    "Ավտոմեքենաների Վարձույթ",
    "Ավտոսպասարկում և Շարժիչի նորոգում",
    "Ավտոլվացում և Քիմմաքրում",
    "Էվակուատորներ և Տեխօգնություն ճանապարհին",
    "Անձնական վարորդի ծառայություններ"
  ],
  "🎓 Կրթություն և Դասընթացներ": [
    "Օտար լեզուների կրկնուսույցներ",
    "Դպրոցական առարկաների պատրաստում",
    "Ծրագրավորման դասընթացներ",
    "Երաժշտություն, Պար և Նկարչություն",
    "Սպորտային մարզիչներ և Յոգա",
    "Քննությունների պատրաստում (SAT, IELTS)"
  ],
  "🛠️ Էլեկտրոնիկայի Վերանորոգում": [
    "Համակարգիչների և նոութբուքերի սպասարկում",
    "Հեռախոսների և պլանշետների նորոգում",
    "Կենցաղային տեխնիկայի վերանորոգում",
    "Հեռուստացույցների և աուդիո տեխնիկայի նորոգում",
    "Անվտանգության համակարգեր և Տեսախցիկներ"
  ],
  "🧹 Կենցաղային Ծառայություններ": [
    "Տների և գրասենյակների Մաքրման աշխատանքներ",
    "Դերձակ, Կար ու Ձև և Նորոգում",
    "Երեխաների Խնամք (Դայակներ)",
    "Տարեցների խնամք և Բուժքույրական օգնություն",
    "Խոհարարական ծառայություններ"
  ],
  "💄 Գեղեցկություն և Առողջություն": [
    "Դիմահարդարում և Մատնահարդարում",
    "Վարսահարդարում և Մազերի խնամք",
    "Մերսում և ՍՊԱ ծառայություններ",
    "Մարզումներ և Դիետոլոգիա"
  ],
  "🎉 Միջոցառումներ և Ֆոտո-Վիդեո": [
    "Ֆոտո և Վիդեո նկարահանում",
    "Ֆուրշետների ձևավորում և Քեյթերինգ",
    "Միջոցառումների կազմակերպում և Հանդիսավարներ",
    "Դիջեյներ (DJ) և Լուսային էֆեկտներ"
  ],
  "🐾 Կենդանիների Համար": [
    "Անասնաբուժական օգնություն",
    "Կենդանիների խնամք և Խուզում (Grooming)",
    "Կենդանիների հյուրանոց և Պահում",
    "Շների վարժեցում և Զբոսանք"
  ],
  "💼 Բիզնես և Իրավաբանություն": [
    "Հաշվապահություն և Ֆինանսներ",
    "Իրավաբաններ և Փաստաբաններ",
    "Թարգմանություններ (Նոտարականով)",
    "Բիզնես պլանների պատրաստում"
  ],
  "✨ Այլ Բաժին": [
    "Այլ Ծառայություն"
  ]
};

// 🎯 2. ՀԱՅԱՍՏԱՆԻ ԲՆԱԿԱՎԱՅՐԵՐԻ ՄԵԿ ՄԻԱՍՆԱԿԱՆ ՑՈՒՑԱԿԸ
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
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Ֆիլտրերի սթեյթերը
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Բոլորը");
  const [selectedLocation, setSelectedLocation] = useState("Բոլորը"); // 🎯 ՆՈՐ ՏԱՐԱԾՔԻ ՖԻԼՏՐ
  const [sortBy, setSortBy] = useState("newest");

  // 🔒 ՄՈԴԱԼԻ ԵՎ ՆՈՐ ՀԱՅՏԱՐԱՐՈՒԹՅԱՆ ՍԹԵՅԹԵՐԸ
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("🏗️ Շինարարություն և Վերանորոգում");
  const [newSubCategory, setNewSubCategory] = useState("Պատերի հարդարում և ներկում (Մալյարկա)");
  const [newLocation, setNewLocation] = useState("Կենտրոն (Երևան)"); // 🎯 Լռելյայն բնակավայր
  const [newDescription, setNewDescription] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

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

  const handleCategoryChange = (categoryName: string) => {
    setNewServiceCategory(categoryName);
    const subCats = NEW_CATEGORIES_DATA[categoryName];
    if (subCats && subCats.length > 0) {
      setNewSubCategory(subCats[0]);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newDescription) {
      alert("Խնդրում ենք լրացնել բոլոր դաշտերը");
      return;
    }

    try {
      setCreateLoading(true);
      const formattedPrice = newPrice.includes("֏") ? newPrice : `${newPrice} ֏`;
      const finalSubCategory = newSubCategory === "Այլ Ծառայություն" ? newTitle : newSubCategory;

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          price: formattedPrice,
          category: newServiceCategory,
          subCategory: finalSubCategory,
          location: newLocation, // 🎯 Ուղարկում ենք միասնական բնակավայրը բազա
          description: newDescription,
        }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewPrice("");
        setNewDescription("");
        setShowCreateModal(false);
        alert("Հայտարարությունը հաջողությամբ ավելացվեց։");
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

  useEffect(() => {
    let result = [...services];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          (s.subCategory && s.subCategory.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== "Բոլորը") {
      result = result.filter((s) => s.category === selectedCategory);
    }

// 🎯 ✅ ՈՒՂՂՎԱԾ ՖԻԼՏՐ. Եթե հին հայտարարություն է ու location չունի, 
    // այն կերևա «Բոլորը» ընտրելիս, իսկ կոնկրետ տարածք ընտրելիս չի խառնվի
    if (selectedLocation !== "Բոլորը") {
      result = result.filter((s) => s.location && s.location === selectedLocation);
    }

    if (sortBy === "newest") {
      result.sort((a, b) => b._id.localeCompare(a._id));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => a._id.localeCompare(b._id));
    }

    setFilteredServices(result);
  }, [searchQuery, selectedCategory, selectedLocation, sortBy, services]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-sm font-bold tracking-widest animate-pulse uppercase">Բեռնվում է...</div>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 lg:px-8 py-12 md:py-20 pb-28 md:pb-24 font-sans text-slate-800 antialiased relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* 🚀 ՇՔԵՂ «HERO» ԲԱՆՆԵՐ */}
        <div className="relative bg-white/[0.02] border border-white/5 rounded-[40px] p-6 sm:p-10 mb-10 overflow-hidden backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Ակնթարթային Պլատֆորմ
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4 leading-tight">
              Գտեք լավագույն <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">մասնագետներին</span> մեկ տեղում
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-medium leading-relaxed">
              Մաքուր, անվտանգ և արագ նամակագրություն անմիջապես մասնագետների հետ։ Առանց միջնորդների և հավելյալ վճարների։
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
            {isAuthenticated ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center px-6 py-4 bg-white hover:bg-emerald-500 hover:text-white text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-2xl transition-all duration-300 active:scale-[0.97] w-full md:w-auto font-sans"
              >
                + Ավելացնել Հայտարարություն
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-4 bg-white hover:bg-indigo-500 hover:text-white text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-2xl transition-all duration-300 active:scale-[0.97] w-full text-center"
              >
                Մուտք գործել կայք
              </Link>
            )}
          </div>
        </div>

       
        {/* 🔍 ՖԻԼՏՐԵՐԻ ԲԼՈԿ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
          <input
            type="text"
            placeholder="Որոնել ծառայություն..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 px-4 py-3 md:py-2.5 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all font-sans"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-white px-4 py-3 md:py-2.5 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all cursor-pointer font-sans"
          >
            <option value="Բոլորը">Բոլոր Կատեգորիաները</option>
            {Object.keys(NEW_CATEGORIES_DATA).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* 🎯 ՏԱՐԱԾՔԻ ԽԵԼԱՑԻ ՖԻԼՏՐ (ԳԼԽԱՎՈՐ ԷՋԻ ՀԱՄԱՐ) */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-white px-4 py-3 md:py-2.5 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all cursor-pointer font-sans"
          >
            <option value="Բոլորը">Բոլոր Բնակավայրերը</option>
            {Object.keys(ARMENIA_LOCATIONS_DATA).map((marz) => (
              <optgroup key={marz} label={marz} className="bg-slate-950 text-slate-400 font-bold">
                {ARMENIA_LOCATIONS_DATA[marz].map((city) => (
                  <option key={city} value={`${city} (${marz})`} className="bg-slate-900 text-white font-medium">
                    {city}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-white px-4 py-3 md:py-2.5 rounded-xl text-xs font-medium outline-none focus:border-emerald-500 transition-all cursor-pointer font-sans"
          >
            <option value="newest">Նորագույն հայտարարություններ</option>
            <option value="oldest">Հնագույն հայտարարություններ</option>
          </select>
        </div>
                {/* 📋 ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆՆԵՐԻ ՑՈՒՑԱԿ */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div 
                key={service._id} 
                className="bg-white border border-slate-100 rounded-[24px] p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] group relative"
              >
                {/* Վերևի մաս՝ Կատեգորիա, Ստատուս և Տարածք */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50/60 px-2.5 py-1 rounded-lg border border-indigo-100/40 font-sans truncate max-w-[150px]">
                      {service.category}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/60 font-sans">
                      {service.status || "Նոր"}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {service.subCategory && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md font-sans truncate max-w-[150px]">
                        📍 {service.subCategory}
                      </span>
                    )}
                    {/* 🎯 ԲՆԱԿԱՎԱՅՐԻ ՍԻՐՈՒՆ ԲԵՅՋԸ ՔԱՐՏԻ ՎՐԱ */}
                    {service.location && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md font-sans truncate max-w-[150px]">
                        🏢 {service.location.split(" (")[0]}
                      </span>
                    )}
                  </div>
                </div>
                {/* Մեջտեղի մաս՝ Վերնագիր, Նկարագրություն և Մասնագետ */}
                <div className="my-1">
                  <h3 className="text-base font-black text-slate-900 tracking-tight line-clamp-1 font-sans">
                    {service.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans min-h-[36px]">
                    {service.description || "Նկարագրություն չկա"}
                  </p>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50 select-none">
                    <div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-black border border-slate-200/40 uppercase">
                      {service.userId?.firstName ? service.userId.firstName.charAt(0) : "✓"}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 font-sans">
                      {service.userId?.firstName ? `${service.userId.firstName} ${service.userId.lastName || ""}` : "Ակտիվ Մասնագետ"}
                    </span>
                  </div>
                </div>

                {/* Ներքևի մաս՝ Արժեք և Կոճակ */}
                <div className="flex items-center justify-between border-t border-slate-50 pt-3.5 mt-0.5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-sans">Արժեքը</span>
                    <span className="text-base font-black text-slate-900 font-mono mt-0.5">
                      {service.price}
                    </span>
                  </div>

                  <Link 
                    href={`/services/${service._id}`}
                    className="px-4 py-2.5 bg-slate-950 hover:bg-emerald-600 text-white font-bold text-xs uppercase rounded-xl transition-all duration-200 active:scale-[0.97] flex items-center gap-2 shadow-sm font-sans"
                  >
                    Մանրամասն 
                    <ArrowRightOutlined className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md border border-dashed border-white/10 rounded-[32px] px-4 font-sans text-sm font-bold text-slate-400">
            Ոչ մի համապատասխան ծառայություն չգտնվեց։
          </div>
        )}
        {/* ========================================================
           🎯 ԲԱԺԻՆ 3. «ԻՆՉՊԵՍ Է ԱՅՆ ԱՇԽԱՏՈՒՄ» ՏԵՂԵԿԱՏՎԱԿԱՆ ԲԼՈԿ
        ======================================================== */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">Ինչպե՞ս է աշխատում Servify-ը</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium font-sans">Ընդամենը 3 պարզ քայլ լավագույն արդյունքին հասնելու համար</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center select-none">
            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center text-sm mx-auto mb-4"><SearchOutlined /></div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans">1. Գտիր մասնագետին</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-2 leading-relaxed font-sans">Օգտագործիր խելացի ֆիլտրերը կամ Live որոնումը վայրկյանների ընթացքում քեզ հարմար մասնագետին գտնելու համար։</p>
            </div>

            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl flex items-center justify-center text-sm mx-auto mb-4"><MessageOutlined /></div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans">2. Գրիր անձնական Չաթով</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-2 leading-relaxed font-sans">Կապվիր անձնական, իրական ժամանակում աշխատող չաթի միջոցով, հարցրու մանրամասները և պայմանավորվիր արագ։</p>
            </div>

            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center text-sm mx-auto mb-4"><CheckCircleOutlined /></div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans">3. Ստացիր Արդյունք</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-2 leading-relaxed font-sans">Վայելիր որակյալ աշխատանքը առանց որևէ միջնորդավճարների կամ պլատֆորմի կողմից պահվող հավելյալ տոկոսների։</p>
            </div>
          </div>
        </div>

        {/* 🔒 ԱՎԵԼԱՑՄԱՆ ՄՈԴԱԼ ՊԱՏՈՒՀԱՆ */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div onClick={() => setShowCreateModal(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity" />

            <div className="bg-white border border-slate-100 rounded-[32px] sm:rounded-[36px] p-5 sm:p-8 max-w-lg w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10 my-auto">
              <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 font-bold text-sm h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center transition-colors">✕</button>

              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight font-sans">Ստեղծել Հայտարարություն</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium font-sans">Լրացրեք ձեր ծառայության տվյալները հարթակում հրապարակելու համար</p>
              </div>

              <form onSubmit={handleCreateService} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Ծառայության անվանումը</label>
                  <input 
                    type="text" 
                    required 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    placeholder="Օրինակ՝ Բնակարանների կապիտալ վերանորոգում"
                    className="w-full border border-slate-200 px-3.5 py-2.5 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 transition-all font-sans" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Արժեքը (֏)</label>
                    <input 
                      type="text" 
                      required 
                      value={newPrice} 
                      onChange={(e) => setNewPrice(e.target.value)} 
                      placeholder="Օրինակ՝ 15,000"
                      className="w-full border border-slate-200 px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 transition-all" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Գլխավոր Բաժին</label>
                    <select
                      value={newServiceCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full border border-slate-200 px-3 py-2.5 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 transition-all cursor-pointer font-sans"
                    >
                      {Object.keys(NEW_CATEGORIES_DATA).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Կոնկրետ Ծառայություն</label>
                    <select
                      value={newSubCategory}
                      onChange={(e) => setNewSubCategory(e.target.value)}
                      className="w-full border border-slate-200 px-3 py-2.5 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 transition-all cursor-pointer font-sans"
                    >
                      {NEW_CATEGORIES_DATA[newServiceCategory]?.map((subCat) => (
                        <option key={subCat} value={subCat}>{subCat}</option>
                      ))}
                    </select>
                  </div>

                  {/* 🎯 ԽԵԼԱՑԻ ՄԻԱՍՆԱԿԱՆ ԲՆԱԿԱՎԱՅՐԻ SELECT ԴԱՇՏԸ ԱՆԱՀԻՏԻ ՀԱՄԱՐ */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Ընտրեք Տարածքը / Քաղաքը</label>
                    <select
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
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

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Մանրամասն Նկարագրություն</label>
                  <textarea 
                    required 
                    rows={4}
                    value={newDescription} 
                    onChange={(e) => setNewDescription(e.target.value)} 
                    placeholder="Նկարագրեք ձեր ծառայությունը, փորձը և պայմանները..."
                    className="w-full border border-slate-200 px-3.5 py-2.5 text-xs font-medium rounded-xl outline-none focus:border-slate-900 bg-slate-50/50 resize-none transition-all leading-relaxed font-sans" 
                  />
                </div>

                <div className="flex items-center gap-3 mt-4 pt-2">
                  <button 
                    type="button" 
                    disabled={createLoading}
                    onClick={() => setShowCreateModal(false)}
                    className="w-1/2 py-3 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-all font-sans"
                  >
                    Չեղարկել
                  </button>
                  <button 
                    type="submit" 
                    disabled={createLoading}
                    className="w-1/2 bg-slate-900 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md uppercase tracking-wider disabled:opacity-50 font-sans"
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
