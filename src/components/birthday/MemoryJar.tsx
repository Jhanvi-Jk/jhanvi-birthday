"use client"

import { useState } from "react"
import type { Memory } from "@/lib/birthday/types"

interface MemoryJarProps {
  memories: Memory[]
}

export default function MemoryJar({ memories }: MemoryJarProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Jar SVG */}
      <div style={{ position: "relative", width: 120 }}>
        <svg width="120" height="140" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
          {/* jar body */}
          <path
            d="M20,40 Q16,42 16,50 L16,118 Q16,128 30,130 L90,130 Q104,130 104,118 L104,50 Q104,42 100,40 Z"
            fill="rgba(200,220,210,0.35)"
            stroke="rgba(150,190,170,0.6)"
            strokeWidth="1.5"
          />
          {/* glass shine */}
          <path d="M24,52 Q22,80 24,110" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* lid */}
          <rect x="18" y="28" width="84" height="16" rx="6" fill="#C9A96E" opacity="0.85"/>
          <rect x="22" y="30" width="76" height="10" rx="4" fill="#E0C080" opacity="0.6"/>
          {/* ribbon around jar */}
          <path d="M16,72 Q60,80 104,72" stroke="#F4A7B9" strokeWidth="5" fill="none" opacity="0.7" strokeLinecap="round"/>
          {/* bow */}
          <path d="M52,68 Q56,58 60,68 Q64,58 68,68 Q64,72 60,70 Q56,72 52,68Z" fill="#F4A7B9" opacity="0.85"/>
          {/* label */}
          <rect x="30" y="85" width="60" height="32" rx="4" fill="rgba(255,252,230,0.8)" stroke="rgba(180,140,80,0.3)" strokeWidth="1"/>
          <text x="60" y="97" textAnchor="middle" fontSize="8" fill="#7A5C44" fontFamily="'Caveat', cursive" fontWeight="600">🌷 Little</text>
          <text x="60" y="109" textAnchor="middle" fontSize="8" fill="#7A5C44" fontFamily="'Caveat', cursive" fontWeight="600">Things</text>
        </svg>

        {/* folded notes peeking out */}
        {memories.slice(0, 3).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 32 + i * 4,
              left: 30 + i * 8,
              width: 22,
              height: 18,
              background: i % 2 === 0 ? "#FEFCE8" : "#FFF0F5",
              border: "1px solid rgba(180,140,60,0.2)",
              borderRadius: "1px 1px 0 0",
              transform: `rotate(${-8 + i * 6}deg)`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              zIndex: 10 - i,
            }}
          />
        ))}
      </div>

      {/* Notes list */}
      {memories.length === 0 ? (
        <p style={{ fontFamily: "'Caveat', cursive", color: "rgba(100,70,50,0.5)", fontSize: 14, textAlign: "center" }}>
          the jar is waiting for memories...
        </p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 340 }}>
          {memories.map((m, i) => (
            <div
              key={m.id}
              className="memory-jar-note"
              style={{ transform: `rotate(${(i % 5 - 2) * 3}deg)` }}
              onClick={() => setOpenId(openId === m.id ? null : m.id)}
            >
              {openId === m.id ? (
                <div className="unfold" style={{ maxWidth: 220, lineHeight: 1.5 }}>{m.content}</div>
              ) : (
                <span style={{ fontSize: 12 }}>📝 unfold</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
