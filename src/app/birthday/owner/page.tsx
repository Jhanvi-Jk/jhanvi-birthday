"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Polaroid from "@/components/birthday/Polaroid"
import type { Polaroid as PolaroidType } from "@/lib/birthday/types"

export default function OwnerPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [authed, setAuthed] = useState(false)
  const [polaroids, setPolaroids] = useState<PolaroidType[]>([])
  const [selected, setSelected] = useState<PolaroidType | null>(null)
  const [caption, setCaption] = useState("")
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem("bdOwnerPass")
    if (saved) { setPassword(saved); setAuthed(true); loadPolaroids() }
  }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/birthday/owner/upload", {
      method: "POST",
      body: (() => { const fd = new FormData(); fd.append("password", password); fd.append("polaroidId", "check"); fd.append("file", new File([], "x")); return fd })(),
    })
    if (res.status === 400) {
      sessionStorage.setItem("bdOwnerPass", password)
      setAuthed(true)
      loadPolaroids()
    } else {
      setMessage("wrong password 🌸")
    }
  }

  async function loadPolaroids(_pass?: string) {
    const res = await fetch("/api/birthday/data")
    const data = await res.json()
    setPolaroids(data.polaroids)
  }

  async function addPolaroid() {
    const res = await fetch("/api/birthday/owner/upload", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, posX: 20 + polaroids.length * 5, posY: 20, rotation: Math.floor(Math.random() * 20) - 10, zIndex: polaroids.length + 1 }),
    })
    const { polaroid } = await res.json()
    setPolaroids(p => [...p, polaroid])
  }

  async function uploadPhoto() {
    if (!selected || !fileRef.current?.files?.[0]) return
    setUploading(true)
    const fd = new FormData()
    fd.append("password", password)
    fd.append("polaroidId", selected.id)
    fd.append("file", fileRef.current.files[0])
    if (caption) fd.append("caption", caption)
    const res = await fetch("/api/birthday/owner/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (data.imageUrl) {
      setPolaroids(p => p.map(pol => pol.id === selected.id ? { ...pol, imageUrl: data.imageUrl, caption: caption || pol.caption } : pol))
      setMessage("photo uploaded ♡")
      setSelected(null)
    } else {
      setMessage("upload failed — try again")
    }
    setUploading(false)
  }

  async function updatePolaroid(id: string, fields: Partial<PolaroidType>) {
    await fetch("/api/birthday/owner/upload", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, polaroidId: id, ...fields }),
    })
    setPolaroids(p => p.map(pol => pol.id === id ? { ...pol, ...fields } : pol))
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <form onSubmit={login} style={{
          background: "rgba(255,252,240,0.95)", border: "1px solid rgba(180,140,90,0.2)",
          borderRadius: 8, padding: "40px 32px", maxWidth: 380, width: "100%",
          textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌸</div>
          <h2 className="font-cormorant" style={{ fontSize: 26, marginBottom: 20 }}>owner access</h2>
          <input className="scrapbook-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="secret password..." autoFocus style={{ marginBottom: 14 }}/>
          {message && <p className="font-caveat" style={{ color: "#C2607A", fontSize: 15, marginBottom: 10 }}>{message}</p>}
          <button type="submit" className="btn-scrapbook" style={{ width: "100%" }}>enter ✦</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="font-cormorant" style={{ fontSize: 30 }}>Jhanvi&apos;s Owner Panel 🌸</h1>
          <p className="font-caveat" style={{ color: "#9B7560", fontSize: 15 }}>manage your polaroids and photos</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-scrapbook-ghost" onClick={() => router.push("/birthday")}>← scrapbook</button>
          <button className="btn-scrapbook" onClick={addPolaroid}>+ add polaroid</button>
        </div>
      </div>

      {message && (
        <div style={{ background: "rgba(180,100,120,0.1)", border: "1px solid rgba(180,100,120,0.3)", borderRadius: 6, padding: "10px 16px", marginBottom: 20 }}>
          <p className="font-caveat" style={{ color: "#7A3050", fontSize: 15, margin: 0 }}>{message}</p>
        </div>
      )}

      {/* Polaroid grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "flex-start" }}>
        {polaroids.length === 0 && (
          <p className="font-caveat" style={{ color: "rgba(120,90,60,0.5)", fontSize: 16 }}>
            no polaroids yet — click &quot;+ add polaroid&quot; to create placeholders ♡
          </p>
        )}
        {polaroids.map(pol => (
          <div
            key={pol.id}
            onClick={() => { setSelected(pol); setCaption(pol.caption ?? "") }}
            style={{
              cursor: "pointer",
              border: selected?.id === pol.id ? "2px solid rgba(180,100,120,0.5)" : "2px solid transparent",
              borderRadius: 6,
              transition: "border-color 0.15s",
              padding: 4,
            }}
          >
            <Polaroid imageUrl={pol.imageUrl} caption={pol.caption ?? undefined} rotation={pol.rotation} />
            <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "center" }}>
              <button
                className="btn-scrapbook-ghost"
                style={{ fontSize: 11, padding: "3px 8px" }}
                onClick={e => { e.stopPropagation(); updatePolaroid(pol.id, { rotation: pol.rotation - 5 }) }}
              >↺</button>
              <button
                className="btn-scrapbook-ghost"
                style={{ fontSize: 11, padding: "3px 8px" }}
                onClick={e => { e.stopPropagation(); updatePolaroid(pol.id, { rotation: pol.rotation + 5 }) }}
              >↻</button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload panel */}
      {selected && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "rgba(255,252,240,0.98)",
          borderTop: "1px solid rgba(180,140,90,0.2)",
          padding: "20px 24px",
          display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center",
          zIndex: 50,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        }}>
          <Polaroid imageUrl={selected.imageUrl} caption={selected.caption ?? undefined} rotation={0} />
          <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              className="scrapbook-input"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="caption (optional)..."
            />
            <input ref={fileRef} type="file" accept="image/*" style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: "#7A5C44" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-scrapbook-ghost" onClick={() => setSelected(null)}>cancel</button>
              <button className="btn-scrapbook" onClick={uploadPhoto} disabled={uploading}>
                {uploading ? "uploading..." : "save photo ✦"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

