"use client";

import { useEffect, useState } from "react";

interface NotificationItem {
  _id: string;
  text: string;
  isRead: boolean;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // 🔄 Կիսաավտոմատ թարմացում ամեն 30 վայրկյանը մեկ
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenDropdown = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && notifications.length > 0) {
      // Երբ բացում ենք, սերվերին ասում ենք, որ բոլորը կարդացվեցին
      try {
        const res = await fetch("/api/notifications", { method: "PUT" });
        if (res.ok) {
          setNotifications([]); // Մաքրում ենք կարմիր թիվը էկրանից
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="relative font-sans text-slate-200">
      {/* 🔔 Զանգակի Կոճակ */}
      <button
        onClick={handleOpenDropdown}
        className="relative p-2 rounded-full hover:bg-slate-900 transition-all text-lg active:scale-95"
      >
        <span>🔔</span>
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center font-mono font-bold text-[9px] animate-bounce">
            {notifications.length}
          </span>
        )}
      </button>

      {/* 📋 Ծանուցումների Բացվող Մենյու (Dropdown) */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in text-xs">
          <div className="border-b border-slate-900 pb-2 mb-2 flex items-center justify-between">
            <span className="font-black text-white">Ծանուցումներ</span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className="p-2.5 bg-slate-900/50 border border-slate-800/60 rounded-xl leading-relaxed text-slate-300 font-medium"
                >
                  {item.text}
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-slate-500 font-medium select-none">
                Նոր ծանուցումներ չկան
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
