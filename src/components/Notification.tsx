"use client";

import { useEffect, useState } from "react";
import { BellOutlined, MailOutlined} from "@ant-design/icons"; // 🎯 Импортируем иконку из Ant Design

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
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Вычисляем только непрочитанные уведомления для красного кружка
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleToggleBell = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    // Только когда пользователь сам кликает и открывает меню
    if (nextState && unreadCount > 0) {
      try {
        const res = await fetch("/api/notifications", { method: "PUT" });
        if (res.ok) {
          // Делаем все уведомления прочитанными на клиенте, чтобы пропала цифра
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="relative font-sans text-slate-200 flex items-center">
      {/* 🔔 Кнопка Колокольчика из Ant Design */}
      <button 
        onClick={handleToggleBell} 
        className="relative p-2 rounded-full hover:bg-slate-900 text-slate-400 hover:text-white transition-all text-xl flex items-center justify-center active:scale-95 outline-none"
      >
        <BellOutlined /> {/* 🎯 Вместо смайлика теперь красивая векторная иконка */}
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center font-mono font-bold text-[9px] animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📋 Выпадающий список уведомлений */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-72 sm:w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs">
          <div className="border-b border-slate-900 pb-2 mb-2">
            <span className="font-black text-white">Ծանուցումներ</span>
          </div>

                   <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item._id}
                  /* ⚡ ՈՒՂՂՎԱԾ. Ավելացրինք flex և items-start, որ իկոնան ու տեքստը կողք-կողքի սիրուն կանգնեն */
                  className={`p-2.5 border rounded-xl leading-relaxed font-medium transition-all flex items-start gap-2.5 ${
                    item.isRead 
                      ? "bg-slate-950/40 border-slate-900 text-slate-500" 
                      : "bg-slate-900/60 border-slate-800 text-slate-200"
                  }`}
                >
                  {/* 🎯 ԽԵԼԱՑԻ ԻԿՈՆԱ. Ծանուցման ձախ կողմում ավտոմատ կվառվի Ant Design-ի ծրարը */}
                  <MailOutlined className={`mt-0.5 text-sm ${item.isRead ? "text-slate-600" : "text-emerald-500"}`} />

                  <span className="flex-1 break-words">{item.text}</span>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-slate-500 font-medium select-none">Ծանուցումներ չկան</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
