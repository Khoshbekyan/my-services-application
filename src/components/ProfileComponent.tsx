// 📄 ՖԱՅԼ: src/components/ProfileComponent.tsx
"use client"

import { useState } from "react"

export default function ProfileComponent() {
  // ⚡ Ինֆորմացիայի state-երը (հետագայում տվյալները կգան բազայից)
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Սեթինգները պահպանելու ֆունկցիան
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      // Այստեղ հետագայում կլինի fetch հարցումը դեպի /api/user/update
      setTimeout(() => {
        setSuccessMessage("Profile updated successfully!")
        setLoading(false)
      }, 1000)
    } catch (err) {
      setErrorMessage("Failed to update profile.")
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* 1. ՁԱԽ ԿՈՂՄ՝ USER CARD (Անձնական քարտ) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col items-center text-center">
        {/* Ավատար (Գեղեցիկ կանաչ ստվերով ու լեթերինգով) */}
        <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-100 mb-4">
          {name.charAt(0)}
        </div>

        {/* Անուն և Մեյլ */}
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{name}</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">{email}</p>

        {/* Status բլոկ */}
        <div className="w-full border-t border-slate-100 mt-6 pt-6 flex flex-col gap-3 text-left text-xs font-semibold text-slate-500">
          <div className="flex justify-between">
            <span>Account Status</span>
            <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Verified</span>
          </div>
          <div className="flex justify-between">
            <span>Joined MiniShop</span>
            <span className="text-slate-800">Sept 2026</span>
          </div>
        </div>
      </div>

      {/* 2. ԱՋ ԿՈՂՄ՝ SETTINGS FORM (Կարգավորումների ձևաչափ) */}
      <div className="lg:grid-cols-1 lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
          
          {/* Հաջողության ծանուցում */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 font-medium px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Էրրորի ծանուցում */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 font-medium px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Բաժին 1: Personal Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-4 border-b border-slate-50 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 px-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 text-sm font-medium rounded-xl outline-none transition-all text-slate-900 bg-slate-50/50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 px-1">Email Address</label>
                <input
                  type="email"
                  disabled 
                  value={email}
                  className="w-full border border-slate-100 px-4 py-2.5 text-sm font-medium rounded-xl text-slate-400 bg-slate-50/30 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Բաժին 2: Security */}
          <div className="mt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-4 border-b border-slate-50 pb-2">
              Change Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 px-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 text-sm font-medium rounded-xl outline-none transition-all text-slate-900 bg-slate-50/50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 px-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 text-sm font-medium rounded-xl outline-none transition-all text-slate-900 bg-slate-50/50 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>
          </div>

          {/* Պահպանելու Կոճակ (Ուղղված է) */}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-100 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Save Settings"}
            </button>
          </div>

        </form>
      </div>

    </div>
  )
}
