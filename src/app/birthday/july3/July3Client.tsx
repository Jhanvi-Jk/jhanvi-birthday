"use client"

import { useEffect, useState } from "react"
import Polaroid from "@/components/birthday/Polaroid"
import CakeDisplay from "@/components/birthday/CakeDisplay"
import MemoryJar from "@/components/birthday/MemoryJar"
import DecorativeElements from "@/components/birthday/DecorativeElements"
import type { Cake, Memory, Word, Polaroid as PolaroidType } from "@/lib/birthday/types"

interface Props {
  words: Word[]
  memories: Memory[]
  polaroids: PolaroidType[]
  cakes: Cake[]
}

const IS_JULY_3 = () => {
  const now = new Date()
  return now.getMonth() === 6 && now.getDate() === 3 // July = month 6
}

const WORD_STARS = [
  { top: "18%", left: "8%",  tilt: -12 },
  { top: "12%", left: "42%", tilt: 4   },
  { top: "14%", right: "10%",tilt: -6  },
  { top: "32%", left: "3%",  tilt: 9   },
  { top: "28%", left: "60%", tilt: -8  },
  { top: "30%", right: "5%", tilt: 5   },
  { top: "48%", left: "15%", tilt: -5  },
  { top: "44%", left: "50%", tilt: 11  },
  { top: "50%", right: "8%", tilt: -9  },
  { top: "64%", left: "6%",  tilt: 7   },
  { top: "60%", left: "38%", tilt: -4  },
  { top: "62%", right: "4%", tilt: 6   },
]

const POLAROID_POS = [
  { top: "6%",  left: "2%",   tilt: -9,  delay: "0.5s" },
  { top: "4%",  right: "3%",  tilt: 7,   delay: "0.9s" },
  { top: "20%", left: "0%",   tilt: 11,  delay: "1.3s" },
  { top: "22%", right: "1%",  tilt: -6,  delay: "0.7s" },
  { top: "40%", left: "1%",   tilt: -13, delay: "1.0s" },
  { top: "38%", right: "0%",  tilt: 8,   delay: "1.5s" },
  { top: "58%", left: "2%",   tilt: 6,   delay: "0.6s" },
  { top: "56%", right: "2%",  tilt: -10, delay: "1.2s" },
  { top: "74%", left: "0%",   tilt: 9,   delay: "0.8s" },
  { top: "72%", right: "1%",  tilt: -7,  delay: "1.1s" },
]

export default function July3Client({ words, memories, polaroids, cakes }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])
  const isToday = IS_JULY_3()

  useEffect(() => {
    // After short delay, show the reveal
    const t = setTimeout(() => setRevealed(true), 600)
    return () => clearTimeout(t)
  }, [])

  // Floating sparkle particles
  useEffect(() => {
    if (!revealed) return
    const interval = setInterval(() => {
      setSparkles(prev => {
        const newSparkle = { id: Date.now(), x: Math.random() * 100, y: 95 }
        return [...prev.slice(-20), newSparkle]
      })
    }, 400)
    return () => clearInterval(interval)
  }, [revealed])

  // Word cloud
  const freq: Record<string, number> = {}
  words.forEach(w => { freq[w.word] = (freq[w.word] ?? 0) + 1 })
  const maxFreq = Math.max(1, ...Object.values(freq))
  const wordEntries = Object.entries(freq).sort((a, b) => b[1] - a[1])

  return (
    <>
      <DecorativeElements />

      {/* Floating golden sparkles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 3 }}>
        {sparkles.map(s => (
          <div
            key={s.id}
            className="particle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              animationDuration: `${2 + Math.random() * 2}s`,
              animationDelay: "0s",
              color: ["✨","⭐","♡","🌸","✦"][Math.floor(Math.random() * 5)],
            }}
          >
            {["✨","⭐","♡","🌸","✦"][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 5, minHeight: "100vh" }}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", padding: "80px 24px 40px", position: "relative" }}>
          <p className="font-caveat" style={{ fontSize: 18, color: "#B08070", marginBottom: 12, opacity: revealed ? 1 : 0, transition: "opacity 1s" }}>
            July 3rd ✦ always and forever
          </p>
          <h1 className="font-cormorant" style={{
            fontSize: "clamp(36px,7vw,64px)",
            fontWeight: 600,
            lineHeight: 1.1,
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(20px)",
            transition: "all 1.2s ease",
          }}>
            🎂 Happy Birthday Jhanvi 🎂
          </h1>
          <p className="font-caveat" style={{
            fontSize: 20,
            color: "#9B7560",
            marginTop: 16,
            opacity: revealed ? 1 : 0,
            transition: "opacity 1.5s ease",
          }}>
            {isToday
              ? "today is your day ♡ everyone&apos;s love is here"
              : "this page blooms on July 3rd — come back then ♡"}
          </p>
        </div>

        {/* ── Scattered Polaroids (sides) ──────────────────────── */}
        {POLAROID_POS.map((pos, i) => {
          const pol = polaroids[i]
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: pos.top,
                left: (pos as { left?: string }).left,
                right: (pos as { right?: string }).right,
                zIndex: 4,
                opacity: revealed ? 1 : 0,
                transition: `opacity 0.8s ease ${pos.delay}`,
              }}
            >
              <Polaroid
                imageUrl={pol?.imageUrl}
                caption={pol?.caption ?? undefined}
                rotation={pos.tilt}
                animationDelay={pos.delay}
              />
            </div>
          )
        })}

        {/* ── Word cloud around center ──────────────────────────── */}
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", minHeight: 320, padding: "0 160px" }}>
          {wordEntries.slice(0, 12).map(([w, count], i) => {
            const size = 16 + (count / maxFreq) * 30
            const pos = WORD_STARS[i % WORD_STARS.length]
            return (
              <span
                key={w}
                className="word-cloud-word"
                style={{
                  position: "absolute",
                  fontSize: size,
                  fontWeight: count > 2 ? 700 : count > 1 ? 500 : 400,
                  ...pos,
                  transform: `rotate(${pos.tilt}deg)`,
                  opacity: revealed ? 1 : 0,
                  transition: `opacity 0.6s ease ${0.3 + i * 0.1}s`,
                }}
              >
                {w}
              </span>
            )
          })}

          {/* Center photo placeholder */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            opacity: revealed ? 1 : 0,
            transition: "opacity 1.5s ease 0.8s",
          }}>
            <Polaroid
              imageUrl={polaroids[0]?.imageUrl}
              caption="jhanvi ♡"
              rotation={0}
            />
          </div>
        </div>

        {/* ── All cakes ──────────────────────────────────────────── */}
        <section style={{ padding: "60px 24px 40px", maxWidth: 900, margin: "0 auto" }}>
          <h2 className="font-cormorant" style={{ fontSize: 28, textAlign: "center", marginBottom: 8, fontStyle: "italic" }}>
            the cakes everyone built for you
          </h2>
          <p className="font-caveat" style={{ textAlign: "center", color: "#9B7560", fontSize: 15, marginBottom: 36 }}>
            each one made with a piece of someone&apos;s love ♡
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
            {cakes.map((cake, i) => (
              <div
                key={cake.id}
                style={{
                  opacity: revealed ? 1 : 0,
                  transition: `opacity 0.6s ease ${0.4 + i * 0.15}s`,
                }}
              >
                <CakeDisplay cake={cake} size={160} />
                <p className="font-caveat" style={{ textAlign: "center", fontSize: 13, color: "#9B7560", marginTop: 8 }}>
                  cake #{cake.orderNum}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Memory jar ─────────────────────────────────────────── */}
        <section style={{ padding: "40px 24px 100px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 className="font-cormorant" style={{ fontSize: 26, marginBottom: 28, fontStyle: "italic" }}>
            little things people left for you
          </h2>
          <MemoryJar memories={memories} />
        </section>

      </div>
    </>
  )
}
