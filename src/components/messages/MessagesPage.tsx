"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  MessageOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from "@ant-design/icons";

interface ChatItem {
  _id: string;
  lastMessage: string;
  updatedAt: string;
  otherUser: {
    _id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
  };
}

interface MessageItem {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export default function MessagesPage() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [loadingChats, setLoadingLoadingChats] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [sendLoading, setSendLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Սկզբնական բեռնում՝ Իմ ID-ն և Չաթերի ցուցակը
  useEffect(() => {
    async function loadChats() {
      try {
        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setMyId(profileData._id || profileData.id);
        }

        const chatsRes = await fetch("/api/messages");
        if (chatsRes.ok) {
          const chatsData = await chatsRes.json();
          setChats(chatsData);
        }
      } catch (err) {
        console.error("Չաթերի բեռնման սխալ:", err);
      } finally {
        setLoadingLoadingChats(false);
      }
    }
    loadChats();
  }, []);

  // 2. Բացված չաթի նամակների բեռնում և ավտոմատ թարմացում (Live Polling)
  useEffect(() => {
    if (!currentChat) return;

    async function fetchMessages() {
      try {
        if (currentChat) {
          const res = await fetch(`/api/messages?chatId=${currentChat._id}`);
          if (res.ok) {
            const data = await res.json();
            setMessages(data);
          }
        }
      } catch (err) {
        console.error("Նամակների բեռնման սխալ:", err);
      }
    }

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [currentChat]);

  // 3. Սահեցնել նամակները դեպի ներքև ամեն նոր նամակի ժամանակ
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // 4. Նամակ ուղարկելու ֆունկցիան (POST)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat || sendLoading) return;

    try {
      setSendLoading(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: currentChat.otherUser._id,
          text: newMessage,
        }),
      });

      if (res.ok) {
        const sentData = await res.json();
        setMessages((prev) => [...prev, sentData.message]);
        setNewMessage("");

        setChats((prevChats) =>
          prevChats.map((c) =>
            c._id === currentChat._id ? { ...c, lastMessage: newMessage } : c,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendLoading(false);
    }
  };

  if (loadingChats) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center font-sans text-xs uppercase tracking-widest text-slate-400 animate-pulse">
        💬 Հաղորդագրությունները բեռնվում են...
      </div>
    );
  }

  return (
    <div className="fixed top-20 bottom-0 left-0 right-0 bg-slate-950 font-sans text-white antialiased flex pb-20 md:pb-0 overflow-hidden z-10 h-[calc(100vh-80px)] w-full">
      <div className="max-w-7xl w-full mx-auto flex h-full border-x border-slate-900">
        {/* 📋 ՁԱԽ ԿՈՂՄ՝ ՉԱԹԵՐԻ ՑՈՒՑԱԿԸ */}
        <div
          className={`w-full md:w-80 border-r border-slate-900 flex flex-col bg-slate-950 shrink-0 ${
            currentChat ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-slate-900">
            <h1 className="text-xl font-black tracking-tight">
              Հաղորդագրություններ
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Ձեր իրական ժամանակի նամակագրությունները
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chats.length > 0 ? (
              chats.map((chat) => {
                const displayName =
                  chat.otherUser.name ||
                  (chat.otherUser.firstName
                    ? `${chat.otherUser.firstName} ${chat.otherUser.lastName || ""}`
                    : chat.otherUser.email);
                return (
                  <button
                    key={chat._id}
                    onClick={() => setCurrentChat(chat)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all duration-150 flex items-center gap-3 active:scale-[0.99] ${
                      currentChat?._id === chat._id
                        ? "bg-white text-slate-950 font-bold"
                        : "hover:bg-slate-900/50 text-slate-300"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                        currentChat?._id === chat._id
                          ? "bg-slate-950 text-white"
                          : "bg-slate-900 text-slate-200"
                      }`}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black truncate">
                        {displayName}
                      </h4>
                      <p
                        className={`text-[11px] truncate mt-0.5 font-medium ${
                          currentChat?._id === chat._id
                            ? "text-slate-700"
                            : "text-slate-500"
                        }`}
                      >
                        {chat.lastMessage || "Նամակագրություն չկա"}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-20 text-slate-600 text-xs font-semibold px-4">
                Ոչ մի ակտիվ չաթ չգտնվեց։ Գնացեք ծառայությունների էջ՝ մասնագետին
                գրելու համար։
              </div>
            )}
          </div>
        </div>
        {/* ✉️ ԱՋ ԿՈՂՄ՝ ՆԱՄԱԿԱԳՐՈՒԹՅԱՆ ՊԱՏՈՒՀԱՆԸ */}
        <div
          className={`flex-1 flex flex-col bg-slate-950/40 backdrop-blur-md ${
            currentChat ? "flex" : "hidden md:flex"
          }`}
        >
          {currentChat ? (
            <>
              {/* Չաթի Վերնագիր */}
              <div className="p-4 border-b border-slate-900 flex items-center gap-3 bg-slate-950">
                {/* 📱 ՄՈԲԱՅԼԻ «ՀԵՏ» ԿՈՃԱԿԸ */}
                <button
                  type="button"
                  onClick={() => setCurrentChat(null)}
                  className="md:hidden p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-400 mr-1 flex items-center gap-1"
                >
                  <ArrowLeftOutlined /> Վերադառնալ հետ
                </button>
                <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-xs font-black">
                  {(
                    currentChat.otherUser.name ||
                    currentChat.otherUser.firstName ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">
                    {currentChat.otherUser.name ||
                      `${currentChat.otherUser.firstName || ""} ${currentChat.otherUser.lastName || ""}`}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    {currentChat.otherUser.email}
                  </p>
                </div>
              </div>

              {/* Նամակների Ցուցակը */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-950/10 to-slate-950">
                {messages.map((msg) => {
                  const isMe = msg.senderId === myId;
                  return (
                    <div
                      key={msg._id}
                      className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed font-medium shadow-sm ${
                          isMe
                            ? "bg-white text-slate-950 rounded-tr-none font-bold"
                            : "bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none"
                        }`}
                      >
                        <p className="break-words whitespace-pre-wrap">
                          {msg.text}
                        </p>
                        <span
                          className={`block text-[8px] mt-1 text-right font-mono ${
                            isMe ? "text-slate-600" : "text-slate-500"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Նամակ Գրելու Ֆորմա */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-900 bg-slate-950 flex items-center gap-3"
              >
                <input
                  type="text"
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Գրեք ձեր հաղորդագրությունը..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-white transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={sendLoading || !newMessage.trim()}
                  className="px-5 py-3 bg-white hover:bg-slate-200 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-30 flex items-center gap-1.5 shadow-md"
                >
                  {sendLoading ? (
                    "..."
                  ) : (
                    <>
                      <SendOutlined /> Ուղարկել
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Դատարկ Պատուհան (Երբ դեռ ոչ մի չաթ ընտրված չէ) */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none text-slate-600 font-semibold text-xs gap-3">
              <MessageOutlined style={{ fontSize: "32px", color: "#475569" }} />
              <p>
                Ընտրեք որևէ նամակագրություն ձախ կողմից՝ խոսակցությունը սկսելու
                համար
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
