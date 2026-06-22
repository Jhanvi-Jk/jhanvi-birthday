"use client"

import { useState } from "react"
import Link from "next/link"
import Polaroid from "./Polaroid"
import CakeDisplay from "./CakeDisplay"
import MemoryJar from "./MemoryJar"
import DecorativeElements from "./DecorativeElements"
import type { Cake, Memory, Word, Polaroid as PolaroidType } from "@/lib/birthday/types"

interface Props {
  cakes: (Cake & { letters: { content: string; contributor: { name: string } }[] })[]
  memories: Memory[]
  words: Word[]
  polaroids: PolaroidType[]
}

// Deterministic scatter positions for cakes — not random (SSR safe)
const CAKE_POSITIONS = [
  { top: "8%",  left: "6%",   tilt: -8  },
  { top: "12%", left: "52%",  tilt: 5   },
  { top: "10%", right: "5%",  tilt: -3  },
  { top: "34%", left: "2%",   tilt: 7   },
  { top: "30%", left: "38%",  tilt: -5  },
  { top: "28%", right: "3%",  tilt: 10  },
  { top: "54%", left: "8%",   tilt: -6  },
  { top: "52%", left: "44%",  tilt: 4   },
  { top: "50%", right: "6%",  tilt: -9  },
  { top: "72%", left: "3%",   tilt: 6   },
  { top: "70%", left: "36%",  tilt: -4  },
  { top: "68%", right: "4%",  tilt: 8   },
]

// Static polaroid scatter positions (empty placeholders)
const STATIC_POLAROIDS = [
  { top: "4%",  left: "28%", tilt: -7,  delay: "0.1s" },
  { top: "6%",  left: "70%", tilt: 4,   delay: "0.2s" },
  { top: "22%", left: "20%", tilt: 9,   delay: "0.3s" },
  { top: "24%", left: "58%", tilt: -5,  delay: "0.15s" },
  { top: "44%", left: "26%", tilt: -11, delay: "0.25s" },
  { top: "42%", left: "64%", tilt: 6,   delay: "0.1s"  },
  { top: "62%", left: "20%", tilt: 8,   delay: "0.2s"  },
  { top: "60%", left: "56%", tilt: -4,  delay: "0.35s" },
  { top: "80%", left: "28%", tilt: -9,  delay: "0.15s" },
  { top: "78%", left: "62%", tilt: 5,   delay: "0.3s"  },
]

function WordCloud({ words }: { words: Word[] }) {
  const freq: Record<string, number> = {}
  words.forEach(w => { freq[w.word] = (freq[w.word] ?? 0) + 1 })
  const maxFreq = Math.max(1, ...Object.values(freq))
  const entries = Object.entries(freq).sort((a, b) => b[1] - a[1])

  const WORD_POSITIONS = [
    { top: "20%", left: "15%", tilt: -10 },
    { top: "10%", left: "55%", tilt: 5   },
    { top: "35%", left: "5%",  tilt: 8   },
    { top: "30%", left: "70%", tilt: -6  },
    { top: "55%", left: "20%", tilt: -4  },
    { top: "50%", left: "60%", tilt: 7   },
    { top: "70%", left: "10%", tilt: 10  },
    { top: "65%", left: "50%", tilt: -8  },
    { top: "80%", left: "30%", tilt: 4   },
    { top: "75%", left: "72%", tilt: -5  },
    { top: "15%", left: "35%", tilt: 3   },
    { top: "45%", left: "40%", tilt: -9  },
  ]

  return (
    <div style={{ position: "relative", width: "100%", minHeight: 260 }}>
      {entries.slice(0, 12).map(([w, count], i) => {
        const size = 14 + (count / maxFreq) * 28
        const pos = WORD_POSITIONS[i % WORD_POSITIONS.length]
        return (
          <span
            key={w}
            className="word-cloud-word"
            style={{
              position: "absolute",
              fontSize: size,
              fontWeight: count > 1 ? 600 : 400,
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.tilt}deg)`,
            }}
          >
            {w}
          </span>
        )
      })}
    </div>
  )
}

function LetterModal({ cake, onClose }: {
  cake: Props["cakes"][number] | null
  onClose: () => void
}) {
  if (!cake) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(50,30,20,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#FFFEF5",
          borderRadius: 6,
          maxWidth: 520,
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "36px 32px",
          position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* tape */}
        <div className="washi washi-pink" style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", width: 70 }}/>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <CakeDisplay cake={cake} size={120} />
        </div>

        <h3 className="font-cormorant" style={{ fontSize: 24, textAlign: "center", marginBottom: 20 }}>
          Cake #{cake.orderNum} — Letters
        </h3>

        {cake.letters.length === 0 ? (
          <p className="font-caveat" style={{ textAlign: "center", color: "#9B7560", fontSize: 16 }}>
            no letters yet for this cake ♡
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {cake.letters.map((l, i) => (
              <div key={i} className="letter-paper" style={{ position: "relative" }}>
                <div className="font-caveat" style={{
                  position: "absolute", top: -10, left: 16,
                  fontSize: 14, color: "#7A5C44",
                  background: "#FFFEF5", padding: "0 8px",
                }}>
                  {l.contributor?.name}
                </div>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.85 }}>{l.content}</p>
              </div>
            ))}
          </div>
        )}

        <button className="btn-scrapbook-ghost" onClick={onClose} style={{ marginTop: 24, width: "100%" }}>
          close ♡
        </button>
      </div>
    </div>
  )
}

export default function ScrapbookDesk({ cakes, memories, words, polaroids }: Props) {
  const [openCake, setOpenCake] = useState<Props["cakes"][number] | null>(null)

  // merge DB polaroids with static placeholder positions
  const allPolaroids = STATIC_POLAROIDS.map((pos, i) => {
    const db = polaroids[i]
    return { ...pos, db }
  })

  return (
    <>
      <DecorativeElements />

      {/* Ambient sound toggles */}
      <AmbientBar />

      <div style={{ position: "relative", zIndex: 5, minHeight: "100vh" }}>

        {/* Hero header */}
        <div style={{ textAlign: "center", paddingTop: 60, paddingBottom: 20, position: "relative" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎂</div>
          <h1 className="font-cormorant" style={{ fontSize: "clamp(32px,6vw,54px)", fontWeight: 600, lineHeight: 1.15, color: "#3D2B1F" }}>
            Happy Birthday Jhanvi
          </h1>
          <p className="font-caveat" style={{ fontSize: 18, color: "#9B7560", marginTop: 8 }}>
            a scrapbook made by everyone who loves you ♡
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
            <Link href="/birthday/join" className="btn-scrapbook" style={{ textDecoration: "none", fontSize: 17 }}>
              add your letter 🎀
            </Link>
            <Link href="/birthday/july3" className="btn-scrapbook-ghost" style={{ textDecoration: "none", fontSize: 16 }}>
              July 3rd reveal ✦
            </Link>
          </div>
        </div>

        {/* Main desk area */}
        <div style={{ position: "relative", minHeight: 900, margin: "0 auto", maxWidth: 1100, padding: "0 16px" }}>

          {/* Only show polaroids that have actual images uploaded */}
          {allPolaroids.filter(p => p.db?.imageUrl).map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: p.top,
                left: p.left,
                zIndex: 3 + (i % 4),
              }}
            >
              <Polaroid
                imageUrl={p.db!.imageUrl}
                caption={p.db?.caption ?? undefined}
                rotation={p.tilt}
                animationDelay={p.delay}
              />
            </div>
          ))}

          {/* Cakes scattered as stickers */}
          {cakes.map((cake, i) => {
            const pos = CAKE_POSITIONS[i % CAKE_POSITIONS.length]
            return (
              <div
                key={cake.id}
                style={{
                  position: "absolute",
                  top: pos.top,
                  left: (pos as { left?: string }).left,
                  right: (pos as { right?: string }).right,
                  zIndex: 6 + i,
                }}
              >
                <CakeDisplay
                  cake={cake}
                  size={130}
                  style={{ transform: `rotate(${pos.tilt}deg)` }}
                  onClick={() => setOpenCake(cake)}
                />
              </div>
            )
          })}

          {/* If no cakes yet, show a gentle prompt */}
          {cakes.length === 0 && (
            <div style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              zIndex: 10,
            }}>
              <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>🎂</div>
              <p className="font-caveat" style={{ fontSize: 18, color: "rgba(120,90,60,0.5)", lineHeight: 1.6 }}>
                the first cake is waiting...<br/>be the first to start it ♡
              </p>
            </div>
          )}
        </div>

        {/* July 3rd teaser banner */}
        <div style={{ maxWidth: 600, margin: "40px auto 0", padding: "0 24px" }}>
          <div style={{
            background: "rgba(255,252,240,0.92)",
            border: "1.5px solid rgba(180,140,90,0.22)",
            borderRadius: 16,
            padding: "24px 32px",
            textAlign: "center",
            position: "relative",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}>
            <div className="washi washi-mint" style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%) rotate(1deg)", width: 60 }} />
            <p className="font-cormorant" style={{ fontSize: 20, fontWeight: 600, color: "#5C3D2E", marginBottom: 6 }}>
              this scrapbook blooms on July 3rd ✦
            </p>
            <p className="font-caveat" style={{ fontSize: 15, color: "#9B7560", lineHeight: 1.6 }}>
              letters, cakes, and memories are being tucked in.<br />
              everything reveals on her birthday — come back then ♡
            </p>
          </div>
        </div>

        {/* Words section */}
        {words.length > 0 && (
          <section style={{ padding: "60px 24px 40px", maxWidth: 760, margin: "0 auto" }}>
            <h2 className="font-cormorant" style={{ fontSize: 28, textAlign: "center", marginBottom: 32, fontStyle: "italic" }}>
              words people use to describe Jhanvi
            </h2>
            <WordCloud words={words} />
          </section>
        )}

        {/* Memory jar */}
        <section style={{ padding: "40px 24px 80px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 className="font-cormorant" style={{ fontSize: 26, marginBottom: 28, fontStyle: "italic" }}>
            the little things jar
          </h2>
          <MemoryJar memories={memories} />
        </section>

      </div>

      {/* Letter modal */}
      <LetterModal cake={openCake} onClose={() => setOpenCake(null)} />
    </>
  )
}

// ─── Ambient sound bar ────────────────────────────────────────────────────────
const AMBIENTS = [
  { id: "rain",      label: "🌧️ Rain",    src: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3" },
  { id: "cafe",      label: "☕ Café",    src: "https://assets.mixkit.co/sfx/preview/mixkit-crowded-coffee-shop-ambiance-492.mp3" },
  { id: "forest",    label: "🌿 Forest",  src: "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3" },
  { id: "fireplace", label: "🕯️ Fire",   src: "https://assets.mixkit.co/sfx/preview/mixkit-fireplace-crackle-ambiance-2030.mp3" },
]

function AmbientBar() {
  const [active, setActive] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [volume, setVolume] = useState(0.3)

  function toggle(id: string, src: string) {
    if (active === id) {
      audio?.pause()
      setActive(null)
      setAudio(null)
      return
    }
    audio?.pause()
    const a = new Audio(src)
    a.loop = true
    a.volume = volume
    a.play().catch(() => {})
    setAudio(a)
    setActive(id)
  }

  function handleVolume(v: number) {
    setVolume(v)
    if (audio) audio.volume = v
  }

  return (
    <div style={{
      position: "fixed",
      bottom: 16,
      right: 16,
      zIndex: 200,
      background: "rgba(255,252,240,0.95)",
      border: "1px solid rgba(180,140,90,0.2)",
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      minWidth: 170,
    }}>
      <p className="font-caveat" style={{ fontSize: 12, color: "#9B7560", margin: 0, textAlign: "center" }}>
        ambience ✦ off by default
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
        {AMBIENTS.map(a => (
          <button
            key={a.id}
            onClick={() => toggle(a.id, a.src)}
            style={{
              background: active === a.id ? "rgba(180,100,120,0.15)" : "transparent",
              border: active === a.id ? "1.5px solid rgba(180,100,120,0.4)" : "1.5px solid rgba(180,140,90,0.2)",
              borderRadius: 20,
              padding: "3px 9px",
              fontFamily: "'Caveat', cursive",
              fontSize: 12,
              color: "#7A5C44",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {a.label}
          </button>
        ))}
      </div>
      {active && (
        <input
          type="range" min={0} max={1} step={0.05}
          value={volume}
          onChange={e => handleVolume(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: "#E8A4B0" }}
        />
      )}
    </div>
  )
}
