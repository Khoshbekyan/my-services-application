// 📄 ՖԱՅԼ: src/components/AdminDashboard.tsx
"use client"

import { useState } from "react"

export default function AdminDashboard() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [category, setCategory] = useState("Audio")
  const [description, setDescription] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price, image, category, description }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Product added successfully! Go to /products to see it.")
        // Մաքրում ենք ֆորման
        setTitle("")
        setPrice("")
        setImage("")
        setDescription("")
      } else {
        setError(data.error || "Failed to add product")
      }
    } catch (err) {
      setError("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.01)] mx-auto">
      <form onSubmit={handleAddProduct} className="flex flex-col gap-5">
        
        {/* Alerts */}
        {message && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 font-semibold px-4 py-3 rounded-2xl text-xs">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 font-semibold px-4 py-3 rounded-2xl text-xs">
            ⚠️ {error}
          </div>
        )}

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 px-1">Product Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Classic Canvas Sneakers"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-200 px-4 py-3 text-sm font-medium rounded-2xl outline-none bg-slate-50/50 focus:border-emerald-500 focus:bg-white"
          />
        </div>

        {/* Price & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 px-1">Price ($)</label>
            <input
              type="number"
              required
              placeholder="e.g. 85"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-slate-200 px-4 py-3 text-sm font-medium rounded-2xl outline-none bg-slate-50/50 focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 px-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-200 px-4 py-3 text-sm font-medium rounded-2xl outline-none bg-slate-50/50 focus:border-emerald-500 focus:bg-white text-slate-800"
            >
              <option value="Audio">Audio</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
              <option value="Workspace">Workspace</option>
              <option value="Gadgets">Gadgets</option>
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 px-1">Image URL (Unsplash Link)</label>
          <input
            type="text"
            required
            placeholder="https://unsplash.com..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-slate-200 px-4 py-3 text-sm font-medium rounded-2xl outline-none bg-slate-50/50 focus:border-emerald-500 focus:bg-white"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 px-1">Description</label>
          <textarea
            required
            rows={3}
            placeholder="Describe your premium drop..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-slate-200 px-4 py-3 text-sm font-medium rounded-2xl outline-none bg-slate-50/50 focus:border-emerald-500 focus:bg-white resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3.5 text-sm font-semibold rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "Publishing Drop..." : "Publish Product Drop →"}
        </button>

      </form>
    </div>
  )
}
