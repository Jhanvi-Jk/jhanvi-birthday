"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const RELATIONSHIPS = [
  { id: "bestfriend",  label: "Best Friend",     emoji: "🌸" },
  { id: "friend",      label: "Friend",           emoji: "✨" },
  { id: "family",      label: "Family",           emoji: "🎀" },
  { id: "classmate",   label: "Classmate",        emoji: "📚" },
  { id: "colleague",   label: "Colleague",        emoji: "🌿" },
  { id: "online",      label: "Online Friend",    emoji: "💫" },
  { id: "neighbour",   label: "Neighbour",        emoji: "🏡" },
  { id: "other",       label: "Someone who loves her", emoji: "♡" },
]

export default function JoinPage() {
  const router = useRouter()
  const [step, setStep] = useState<"name" | "relation" | "owner">("name")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")

  async function handleOwnerLogin(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.append("password", password)
    fd.append("polaroidId", "check")
    fd.append("file", new File([], "x"))
    const res = await fetch("/api/birthday/owner/upload", { method: "POST", body: fd })
    if (res.status === 400) {
      sessionStorage.setItem("bdOwnerPass", password)
      router.push("/birthday/owner")
    } else {
      setError("That's not quite right 🌸 try again?")
    }
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setStep("relation")
  }

  function handleRelationSelect(id: string) {
    setRelation(id)
    sessionStorage.setItem("bdContributorName", name.trim())
    sessionStorage.setItem("bdContributorRelation", id)
    router.push("/birthday/contribute")
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      position: "relative",
      zIndex: 5,
    }}>
      <div style={{ position: "absolute", top: "10%", left: "8%",  fontSize: 28, opacity: 0.6, transform: "rotate(-12deg)" }}>🌸</div>
      <div style={{ position: "absolute", top: "15%", right: "10%",fontSize: 22, opacity: 0.5, transform: "rotate(8deg)"   }}>🌷</div>
      <div style={{ position: "absolute", bottom: "15%", left: "12%", fontSize: 18, opacity: 0.55, transform: "rotate(15deg)" }}>🌿</div>
      <div style={{ position: "absolute", bottom: "20%", right: "8%", fontSize: 24, opacity: 0.5, transform: "rotate(-5deg)"  }}>✨</div>

      <div style={{
        background: "rgba(255,252,240,0.95)",
        border: "1px solid rgba(180,140,90,0.2)",
        borderRadius: 8,
        padding: "48px 40px",
        maxWidth: 480,
        width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
        position: "relative",
        textAlign: "center",
      }}>
        <div className="washi washi-pink" style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%) rotate(-1.5deg)", width: 80 }} />

        <div style={{ fontSize: 36, marginBottom: 8 }}>🎂</div>
        <h1 className="font-cormorant" style={{ fontSize: 30, fontWeight: 600, marginBottom: 8, lineHeight: 1.2 }}>
          Welcome to Jhanvi&apos;s<br/>Birthday Scrapbook
        </h1>
        <p className="font-caveat" style={{ fontSize: 16, color: "#9B7560", marginBottom: 32 }}>
          a little corner made with love ♡
        </p>

        {/* ── Step 1: name ── */}
        {step === "name" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <form onSubmit={handleNameSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label className="font-caveat" style={{ fontSize: 17, color: "#7A5C44", textAlign: "left" }}>
                your name ✦
              </label>
              <input
                className="scrapbook-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="write your name here..."
                autoComplete="off"
                autoFocus
                required
              />
              <button type="submit" className="btn-scrapbook" style={{ marginTop: 6 }} disabled={!name.trim()}>
                continue 🎀
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(180,140,90,0.2)" }}/>
              <span className="font-caveat" style={{ fontSize: 14, color: "rgba(120,90,60,0.5)" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(180,140,90,0.2)" }}/>
            </div>

            <button className="btn-scrapbook-ghost" onClick={() => setStep("owner")}>
              I&apos;m Jhanvi 🌸
            </button>
          </div>
        )}

        {/* ── Step 2: relationship ── */}
        {step === "relation" && (
          <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <p className="font-cormorant" style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
                hi {name} ♡
              </p>
              <p className="font-caveat" style={{ fontSize: 16, color: "#9B7560" }}>
                how do you know Jhanvi?
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {RELATIONSHIPS.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleRelationSelect(r.id)}
                  style={{
                    background: relation === r.id ? "rgba(180,100,120,0.12)" : "rgba(255,252,240,0.9)",
                    border: "1.5px solid rgba(180,140,90,0.25)",
                    borderRadius: 10,
                    padding: "14px 10px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s ease",
                    fontFamily: "'Caveat', cursive",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(180,100,120,0.45)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(180,140,90,0.25)")}
                >
                  <span style={{ fontSize: 22 }}>{r.emoji}</span>
                  <span style={{ fontSize: 14, color: "#5C3D2E", lineHeight: 1.3 }}>{r.label}</span>
                </button>
              ))}
            </div>

            <button className="btn-scrapbook-ghost" style={{ fontSize: 14 }} onClick={() => setStep("name")}>
              ← back
            </button>
          </div>
        )}

        {/* ── Step 3: owner password ── */}
        {step === "owner" && (
          <form onSubmit={handleOwnerLogin} className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p className="font-caveat" style={{ fontSize: 16, color: "#9B7560" }}>
              prove it 🌷
            </p>
            <input
              className="scrapbook-input"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError("") }}
              placeholder="secret password..."
              autoFocus
            />
            {error && <p className="font-caveat" style={{ color: "#C2607A", fontSize: 15 }}>{error}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="btn-scrapbook-ghost" style={{ flex: 1 }} onClick={() => setStep("name")}>
                ← back
              </button>
              <button type="submit" className="btn-scrapbook" style={{ flex: 2 }}>
                enter ✦
              </button>
            </div>
          </form>
        )}

        <p className="font-caveat" style={{ marginTop: 24, fontSize: 13, color: "rgba(120,90,60,0.45)" }}>
          everyone is welcome here ♡
        </p>
      </div>
    </div>
  )
}
