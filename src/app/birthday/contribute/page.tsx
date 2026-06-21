"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CakeDisplay from "@/components/birthday/CakeDisplay"
import { SHAPES, getFrostings, getDecorations, getRibbons, getCandles, SLOT_LABELS } from "@/lib/birthday/cake-options"
import type { Cake, CakeOption } from "@/lib/birthday/types"

type Step = "cake" | "letter" | "memory" | "word" | "done"

export default function ContributePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [step, setStep] = useState<Step>("cake")
  const [currentCake, setCurrentCake] = useState<Cake | null>(null)
  const [mySlot, setMySlot] = useState(1)
  const [previewCake, setPreviewCake] = useState<Partial<Cake>>({})
  const [selectedChoice, setSelectedChoice] = useState<string>("")
  const [letter, setLetter] = useState("")
  const [memory, setMemory] = useState("")
  const [word, setWord] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const savedName = sessionStorage.getItem("bdContributorName")
    if (!savedName) { router.push("/birthday/join"); return }
    setName(savedName)
    fetchActiveCake()
  }, [])

  async function fetchActiveCake() {
    setLoading(true)
    const res = await fetch("/api/birthday/contribute")
    const { cake, nextSlot } = await res.json()
    setCurrentCake(cake)
    setMySlot(nextSlot)
    setPreviewCake(cake)
    setLoading(false)
  }

  function getOptions(): CakeOption[] {
    if (!currentCake) return SHAPES
    switch (mySlot) {
      case 1: return SHAPES
      case 2: return getFrostings(currentCake.shape!)
      case 3: return getDecorations(currentCake.shape!, currentCake.frostingColor!)
      case 4: return getRibbons(currentCake.frostingColor!)
      case 5: return getCandles(currentCake.frostingColor!)
      default: return []
    }
  }

  function handleOptionSelect(option: CakeOption) {
    setSelectedChoice(option.id)
    // live preview
    const field = ["shape","frostingColor","decoration","ribbon","candles"][mySlot - 1]
    setPreviewCake(prev => ({ ...prev, [field]: option.id }))
  }

  async function handleCakeSubmit() {
    if (!selectedChoice || !currentCake) return
    setSubmitting(true)
    await fetch("/api/birthday/contribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        choice: selectedChoice,
        slotNum: mySlot,
        cakeId: currentCake.id,
      }),
    })
    setSubmitting(false)
    setStep("letter")
  }

  async function handleFinalSubmit() {
    setSubmitting(true)
    await fetch("/api/birthday/contribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        choice: selectedChoice || "—",
        slotNum: mySlot,
        cakeId: currentCake?.id,
        letter: letter.trim() || undefined,
        memory: memory.trim() || undefined,
        word: word.trim() || undefined,
      }),
    })
    setSubmitting(false)
    setStep("done")
  }

  const slotLabel = SLOT_LABELS[mySlot] ?? "Build the cake"
  const options = getOptions()

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="font-caveat" style={{ fontSize: 20, color: "#9B7560" }}>preparing your spot... 🌸</p>
      </div>
    )
  }

  if (step === "done") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 32, position: "relative", zIndex: 5 }}>
        <div style={{ fontSize: 48 }}>🎀</div>
        <h2 className="font-cormorant" style={{ fontSize: 32, textAlign: "center" }}>thank you, {name} ♡</h2>
        <p className="font-caveat" style={{ fontSize: 18, color: "#9B7560", textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
          your letter, wish, and memory have been tucked into Jhanvi&apos;s scrapbook forever.
        </p>
        <CakeDisplay cake={previewCake} size={180} style={{ marginTop: 8 }} />
        <button className="btn-scrapbook" onClick={() => router.push("/birthday")} style={{ marginTop: 16 }}>
          see the scrapbook ✦
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 20px", position: "relative", zIndex: 5, gap: 0 }}>

      {/* Step: cake building */}
      {step === "cake" && (
        <div className="fade-in-up" style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <p className="font-caveat" style={{ fontSize: 15, color: "#B08070", marginBottom: 4 }}>
              hi {name} ✦ slot {mySlot} of 5
            </p>
            <h2 className="font-cormorant" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}>
              {slotLabel}
            </h2>
            <p className="font-caveat" style={{ fontSize: 14, color: "rgba(120,90,60,0.55)", marginTop: 6 }}>
              your choice will be locked in forever 🌸
            </p>
          </div>

          {/* Live cake preview */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <CakeDisplay cake={previewCake} size={180} />
          </div>

          {/* Options grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 10,
          }}>
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleOptionSelect(opt)}
                style={{
                  background: selectedChoice === opt.id
                    ? "rgba(180,100,120,0.12)"
                    : "rgba(255,252,240,0.8)",
                  border: selectedChoice === opt.id
                    ? "2px solid rgba(180,100,120,0.5)"
                    : "1.5px solid rgba(180,140,90,0.25)",
                  borderRadius: 8,
                  padding: "12px 10px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.15s ease",
                  fontFamily: "'Caveat', cursive",
                }}
              >
                {opt.color && (
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: opt.color,
                    border: "2px solid rgba(180,140,90,0.2)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}/>
                )}
                {opt.emoji && <span style={{ fontSize: 24 }}>{opt.emoji}</span>}
                <span style={{ fontSize: 14, color: "#5C3D2E", textAlign: "center", lineHeight: 1.3 }}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          <button
            className="btn-scrapbook"
            onClick={handleCakeSubmit}
            disabled={!selectedChoice || submitting}
            style={{ marginTop: 8, opacity: selectedChoice ? 1 : 0.5 }}
          >
            {submitting ? "saving..." : "lock in my choice ✦"}
          </button>
        </div>
      )}

      {/* Step: letter */}
      {step === "letter" && (
        <div className="fade-in-up" style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✉️</div>
            <h2 className="font-cormorant" style={{ fontSize: 28, fontWeight: 600 }}>write a letter to Jhanvi</h2>
            <p className="font-caveat" style={{ fontSize: 15, color: "#9B7560", marginTop: 4 }}>
              this will live on her cake forever ♡
            </p>
          </div>

          {/* Letter paper */}
          <div style={{ position: "relative" }}>
            <div className="font-caveat" style={{
              position: "absolute",
              top: -10,
              left: 16,
              fontSize: 15,
              color: "#7A5C44",
              background: "rgba(255,252,240,0.95)",
              padding: "0 8px",
              zIndex: 1,
            }}>
              {name}
            </div>
            <textarea
              className="scrapbook-textarea"
              value={letter}
              onChange={e => setLetter(e.target.value)}
              placeholder="dear jhanvi, ..."
              style={{ minHeight: 200 }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-scrapbook-ghost" onClick={() => setStep("memory")} style={{ flex: 1 }}>
              skip for now
            </button>
            <button className="btn-scrapbook" onClick={() => setStep("memory")} style={{ flex: 2 }}>
              next → 🌸
            </button>
          </div>
        </div>
      )}

      {/* Step: memory jar */}
      {step === "memory" && (
        <div className="fade-in-up" style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🌷</div>
            <h2 className="font-cormorant" style={{ fontSize: 28, fontWeight: 600 }}>drop something in the jar</h2>
            <p className="font-caveat" style={{ fontSize: 15, color: "#9B7560", marginTop: 4 }}>
              a nickname, a memory, an inside joke — anything ♡
            </p>
          </div>

          <textarea
            className="scrapbook-textarea"
            value={memory}
            onChange={e => setMemory(e.target.value)}
            placeholder='"remember that time we..." / "drink water 😭" / your nickname for her'
            style={{ minHeight: 120 }}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-scrapbook-ghost" onClick={() => setStep("word")} style={{ flex: 1 }}>
              skip
            </button>
            <button className="btn-scrapbook" onClick={() => setStep("word")} style={{ flex: 2 }}>
              next → ✦
            </button>
          </div>
        </div>
      )}

      {/* Step: one word */}
      {step === "word" && (
        <div className="fade-in-up" style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⭐</div>
            <h2 className="font-cormorant" style={{ fontSize: 28, fontWeight: 600 }}>one word for Jhanvi</h2>
            <p className="font-caveat" style={{ fontSize: 15, color: "#9B7560", marginTop: 4 }}>
              this goes on her final birthday page as a word cloud ♡
            </p>
          </div>

          <input
            className="scrapbook-input"
            value={word}
            onChange={e => setWord(e.target.value.replace(/\s+/g, ""))}
            placeholder="funny / kind / chaotic / beautiful..."
            style={{ fontSize: 20, textAlign: "center" }}
            maxLength={20}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-scrapbook-ghost" onClick={handleFinalSubmit} style={{ flex: 1 }} disabled={submitting}>
              {submitting ? "..." : "skip"}
            </button>
            <button className="btn-scrapbook" onClick={handleFinalSubmit} style={{ flex: 2 }} disabled={submitting}>
              {submitting ? "saving everything... 🌸" : "seal it with love 🎀"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
