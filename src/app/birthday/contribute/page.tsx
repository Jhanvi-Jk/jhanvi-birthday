"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CakeDisplay from "@/components/birthday/CakeDisplay"
import { SHAPES, getFrostings, getDecorations, getRibbons, getCandles, SLOT_LABELS } from "@/lib/birthday/cake-options"
import type { Cake, CakeOption } from "@/lib/birthday/types"

type Step = "cake" | "confirm" | "letter" | "memory" | "word" | "done"

// Step index for progress bar (confirm is inline, not counted separately)
const STEP_ORDER: Step[] = ["cake", "letter", "memory", "word", "done"]
const STEP_LABELS = ["🎂 cake", "✉️ letter", "🌷 memory", "⭐ word", "🎀 done"]

function ProgressBar({ current }: { current: Step }) {
  const idx = STEP_ORDER.indexOf(current === "confirm" ? "cake" : current)
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 28 }}>
      {STEP_LABELS.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i < idx ? "#C2A0B0" : i === idx ? "#C2607A" : "rgba(180,140,90,0.15)",
              border: i === idx ? "2px solid #C2607A" : "2px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, transition: "all 0.3s ease",
              boxShadow: i === idx ? "0 0 0 3px rgba(194,96,122,0.15)" : "none",
            }}>
              {i < idx
                ? <span style={{ color: "white", fontSize: 13 }}>✓</span>
                : <span style={{ fontSize: 12 }}>{i + 1}</span>}
            </div>
            <span style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 11,
              color: i <= idx ? "#7A5C44" : "rgba(120,90,60,0.4)",
              whiteSpace: "nowrap",
            }}>{label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div style={{
              width: 32, height: 2, marginBottom: 18,
              background: i < idx ? "#C2A0B0" : "rgba(180,140,90,0.15)",
              transition: "background 0.3s ease",
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function ContributePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [step, setStep] = useState<Step>("cake")
  const [currentCake, setCurrentCake] = useState<Cake | null>(null)
  const [mySlot, setMySlot] = useState(1)
  const [previewCake, setPreviewCake] = useState<Partial<Cake>>({})
  const [selectedChoice, setSelectedChoice] = useState<string>("")
  const [selectedLabel, setSelectedLabel] = useState<string>("")
  const [letter, setLetter] = useState("")
  const [memory, setMemory] = useState("")
  const [word, setWord] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)

  useEffect(() => {
    const savedName = sessionStorage.getItem("bdContributorName")
    if (!savedName) { router.push("/birthday/join"); return }
    setName(savedName)

    // Guard: already contributed this session
    if (sessionStorage.getItem("bdContributed") === "true") {
      setAlreadyDone(true)
      return
    }

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
    setSelectedLabel(option.label)
    const field = ["shape", "frostingColor", "decoration", "ribbon", "candles"][mySlot - 1]
    setPreviewCake(prev => ({ ...prev, [field]: option.id }))
  }

  function handleLockClick() {
    if (!selectedChoice) return
    setStep("confirm")
  }

  async function handleConfirmed() {
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
    sessionStorage.setItem("bdContributed", "true")
    setSubmitting(false)
    setStep("done")
  }

  const slotLabel = SLOT_LABELS[mySlot] ?? "Build the cake"
  const options = getOptions()

  // ── Already contributed ──────────────────────────────────────────────────
  if (alreadyDone) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
        <div style={{ fontSize: 48 }}>🌸</div>
        <h2 className="font-cormorant" style={{ fontSize: 28, textAlign: "center" }}>you&apos;ve already added your love ♡</h2>
        <p className="font-caveat" style={{ fontSize: 17, color: "#9B7560", textAlign: "center", maxWidth: 300, lineHeight: 1.6 }}>
          your letter, memory, and word are tucked safely into Jhanvi&apos;s scrapbook.
        </p>
        <button className="btn-scrapbook" onClick={() => router.push("/birthday")}>
          see the scrapbook ✦
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="font-caveat" style={{ fontSize: 20, color: "#9B7560" }}>preparing your spot... 🌸</p>
      </div>
    )
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, position: "relative", zIndex: 5 }}>
        <div style={{ fontSize: 48 }}>🎀</div>
        <h2 className="font-cormorant" style={{ fontSize: 32, textAlign: "center" }}>thank you, {name} ♡</h2>
        <p className="font-caveat" style={{ fontSize: 18, color: "#9B7560", textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
          your letter, wish, and memory have been<br />tucked into Jhanvi&apos;s scrapbook forever.
        </p>
        <div style={{
          background: "rgba(255,252,240,0.9)",
          border: "1.5px solid rgba(180,140,90,0.2)",
          borderRadius: 16,
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}>
          <p className="font-caveat" style={{ fontSize: 13, color: "rgba(120,90,60,0.5)", marginBottom: 4 }}>your contribution to the cake</p>
          <CakeDisplay cake={previewCake} size={160} />
        </div>
        <button className="btn-scrapbook" onClick={() => router.push("/birthday")} style={{ marginTop: 8 }}>
          see the scrapbook ✦
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", position: "relative", zIndex: 5, gap: 0 }}>

      {/* ── Confirm step (inline overlay) ──────────────────────────────── */}
      {step === "confirm" && (
        <div className="fade-in-up" style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>
          <ProgressBar current="cake" />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
            <h2 className="font-cormorant" style={{ fontSize: 26, fontWeight: 600 }}>lock this in forever?</h2>
            <p className="font-caveat" style={{ fontSize: 15, color: "#9B7560", marginTop: 6 }}>
              this can&apos;t be changed once you confirm
            </p>
          </div>
          <div style={{
            background: "rgba(255,252,240,0.95)",
            border: "1.5px solid rgba(180,140,90,0.22)",
            borderRadius: 14,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}>
            <CakeDisplay cake={previewCake} size={140} />
            <div style={{ textAlign: "center" }}>
              <p className="font-caveat" style={{ fontSize: 14, color: "rgba(120,90,60,0.6)" }}>
                slot {mySlot} of 5 — {SLOT_LABELS[mySlot]}
              </p>
              <p className="font-cormorant" style={{ fontSize: 22, fontWeight: 600, color: "#5C3D2E", marginTop: 4 }}>
                {selectedLabel}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-scrapbook-ghost" style={{ flex: 1 }} onClick={() => setStep("cake")}>
              ← change it
            </button>
            <button className="btn-scrapbook" style={{ flex: 2 }} onClick={handleConfirmed} disabled={submitting}>
              {submitting ? "locking in... 🌸" : "yes, lock it in ✦"}
            </button>
          </div>
        </div>
      )}

      {/* ── Cake step ──────────────────────────────────────────────────── */}
      {step === "cake" && (
        <div className="fade-in-up" style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>
          <ProgressBar current="cake" />

          <div style={{ textAlign: "center" }}>
            <p className="font-caveat" style={{ fontSize: 15, color: "#B08070", marginBottom: 4 }}>
              hi {name} ✦ slot {mySlot} of 5
            </p>
            <h2 className="font-cormorant" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}>
              {slotLabel}
            </h2>
            <p className="font-caveat" style={{ fontSize: 13, color: "rgba(120,90,60,0.5)", marginTop: 5 }}>
              your choice will be locked in forever 🌸
            </p>
          </div>

          {/* Live cake preview */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CakeDisplay cake={previewCake} size={160} />
          </div>

          {/* Options grid */}
          <style>{`
            .cake-opt-btn:hover .cake-opt-icon { transform: translateY(-5px) scale(1.12); }
            .cake-opt-btn:hover { border-color: rgba(180,100,120,0.45) !important; }
          `}</style>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleOptionSelect(opt)}
                className="cake-opt-btn"
                style={{
                  background: selectedChoice === opt.id ? "rgba(180,100,120,0.12)" : "rgba(255,252,240,0.8)",
                  border: selectedChoice === opt.id ? "2px solid rgba(180,100,120,0.5)" : "1.5px solid rgba(180,140,90,0.25)",
                  borderRadius: 8,
                  padding: "12px 10px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  transition: "border-color 0.15s ease",
                  fontFamily: "'Caveat', cursive",
                }}
              >
                <span className="cake-opt-icon" style={{ display: "inline-block", transition: "transform 0.2s ease" }}>
                  {opt.color && (
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: opt.color,
                      border: "2px solid rgba(180,140,90,0.2)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }} />
                  )}
                  {mySlot === 1 ? (
                    <CakeDisplay cake={{ shape: opt.id as never }} size={64} />
                  ) : (
                    opt.emoji && <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                  )}
                </span>
                <span style={{ fontSize: 14, color: "#5C3D2E", textAlign: "center", lineHeight: 1.3 }}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          <button
            className="btn-scrapbook"
            onClick={handleLockClick}
            disabled={!selectedChoice}
            style={{ marginTop: 4, opacity: selectedChoice ? 1 : 0.5 }}
          >
            lock in my choice ✦
          </button>
        </div>
      )}

      {/* ── Letter step ────────────────────────────────────────────────── */}
      {step === "letter" && (
        <div className="fade-in-up" style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>
          <ProgressBar current="letter" />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✉️</div>
            <h2 className="font-cormorant" style={{ fontSize: 28, fontWeight: 600 }}>write a letter to Jhanvi</h2>
            <p className="font-caveat" style={{ fontSize: 15, color: "#9B7560", marginTop: 4 }}>
              this will live on her cake forever ♡
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <div className="font-caveat" style={{
              position: "absolute", top: -10, left: 16, fontSize: 15,
              color: "#7A5C44", background: "rgba(255,252,240,0.95)", padding: "0 8px", zIndex: 1,
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
            <button className="btn-scrapbook-ghost" onClick={() => setStep("memory")} style={{ flex: 1 }}>skip</button>
            <button className="btn-scrapbook" onClick={() => setStep("memory")} style={{ flex: 2 }}>next → 🌸</button>
          </div>
        </div>
      )}

      {/* ── Memory step ────────────────────────────────────────────────── */}
      {step === "memory" && (
        <div className="fade-in-up" style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>
          <ProgressBar current="memory" />
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
            <button className="btn-scrapbook-ghost" onClick={() => setStep("word")} style={{ flex: 1 }}>skip</button>
            <button className="btn-scrapbook" onClick={() => setStep("word")} style={{ flex: 2 }}>next → ✦</button>
          </div>
        </div>
      )}

      {/* ── Word step ──────────────────────────────────────────────────── */}
      {step === "word" && (
        <div className="fade-in-up" style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>
          <ProgressBar current="word" />
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
