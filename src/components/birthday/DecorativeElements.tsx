"use client"

// Scattered washi tape strips, pressed flowers, hearts, stars, etc.
// Nothing is aligned — everything feels handmade.

const ELEMENTS = [
  // washi tape strips (horizontal/diagonal)
  { type: "washi", color: "washi-pink",     style: { top: "8%",  left: "3%",  width: 90,  transform: "rotate(-8deg)"  } },
  { type: "washi", color: "washi-mint",     style: { top: "15%", right: "4%", width: 70,  transform: "rotate(5deg)"   } },
  { type: "washi", color: "washi-yellow",   style: { top: "38%", left: "1%",  width: 110, transform: "rotate(3deg)"   } },
  { type: "washi", color: "washi-lavender", style: { top: "62%", right: "2%", width: 85,  transform: "rotate(-4deg)"  } },
  { type: "washi", color: "washi-peach",    style: { top: "80%", left: "5%",  width: 65,  transform: "rotate(7deg)"   } },
  { type: "washi", color: "washi-pink",     style: { top: "91%", right: "6%", width: 95,  transform: "rotate(-3deg)"  } },

  // pressed flowers / botanicals
  { type: "emoji", emoji: "🌸", style: { top: "12%",  left: "7%",  fontSize: 22, transform: "rotate(-15deg)", opacity: 0.8 } },
  { type: "emoji", emoji: "🌿", style: { top: "22%",  right: "8%", fontSize: 18, transform: "rotate(20deg)",  opacity: 0.75 } },
  { type: "emoji", emoji: "🌷", style: { top: "44%",  left: "4%",  fontSize: 20, transform: "rotate(-8deg)",  opacity: 0.8 } },
  { type: "emoji", emoji: "🌸", style: { top: "55%",  right: "5%", fontSize: 16, transform: "rotate(12deg)",  opacity: 0.7 } },
  { type: "emoji", emoji: "🍃", style: { top: "70%",  left: "6%",  fontSize: 14, transform: "rotate(-22deg)", opacity: 0.7 } },
  { type: "emoji", emoji: "🌼", style: { top: "85%",  right: "9%", fontSize: 20, transform: "rotate(5deg)",   opacity: 0.8 } },

  // tiny hearts
  { type: "heart", style: { top: "18%",  left: "12%", fontSize: 11, color: "#E8A4B0", transform: "rotate(-10deg)" } },
  { type: "heart", style: { top: "32%",  right: "14%",fontSize: 9,  color: "#C9B1E8", transform: "rotate(8deg)"   } },
  { type: "heart", style: { top: "48%",  left: "9%",  fontSize: 13, color: "#F4A7B9", transform: "rotate(-5deg)"  } },
  { type: "heart", style: { top: "67%",  right: "11%",fontSize: 10, color: "#E8A4B0", transform: "rotate(15deg)"  } },
  { type: "heart", style: { top: "78%",  left: "14%", fontSize: 8,  color: "#D4A0A7", transform: "rotate(-12deg)" } },

  // stars / sparkles
  { type: "emoji", emoji: "✨", style: { top: "7%",   right: "15%", fontSize: 14, opacity: 0.7 } },
  { type: "emoji", emoji: "⭐", style: { top: "27%",  left: "2%",   fontSize: 12, opacity: 0.6, transform: "rotate(20deg)" } },
  { type: "emoji", emoji: "✨", style: { top: "73%",  right: "18%", fontSize: 16, opacity: 0.65 } },
  { type: "emoji", emoji: "🌟", style: { top: "88%",  left: "2%",   fontSize: 13, opacity: 0.6 } },

  // postage stamps (small squares)
  { type: "stamp", style: { top: "25%", right: "2%",  transform: "rotate(6deg)"  } },
  { type: "stamp", style: { top: "58%", left: "0.5%", transform: "rotate(-9deg)" } },
  { type: "stamp", style: { top: "92%", right: "3%",  transform: "rotate(4deg)"  } },

  // paper clips
  { type: "emoji", emoji: "📎", style: { top: "41%", right: "1%", fontSize: 16, transform: "rotate(-20deg)", opacity: 0.65 } },
  { type: "emoji", emoji: "📎", style: { top: "77%", left: "1%",  fontSize: 14, transform: "rotate(15deg)",  opacity: 0.6  } },

  // bows / ribbons
  { type: "emoji", emoji: "🎀", style: { top: "5%",  left: "1%",   fontSize: 16, opacity: 0.8  } },
  { type: "emoji", emoji: "🎀", style: { top: "50%", right: "0.5%",fontSize: 13, opacity: 0.75 } },
  { type: "emoji", emoji: "🎀", style: { top: "95%", left: "8%",   fontSize: 18, opacity: 0.8  } },
]

const STAMP_EMOJIS = ["🌹", "🦋", "🌙", "🌸", "☁️"]

export default function DecorativeElements() {
  return (
    <div className="pointer-events-none select-none" style={{ position: "fixed", inset: 0, zIndex: 2 }}>
      {ELEMENTS.map((el, i) => {
        if (el.type === "washi") {
          return (
            <div
              key={i}
              className={`washi ${el.color}`}
              style={{ position: "absolute", width: el.style.width, ...el.style }}
            />
          )
        }
        if (el.type === "heart") {
          return (
            <div
              key={i}
              style={{ position: "absolute", fontSize: el.style.fontSize, color: el.style.color, ...el.style }}
            >
              ♡
            </div>
          )
        }
        if (el.type === "stamp") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 32,
                height: 38,
                background: "#FFF9F0",
                border: "1.5px solid rgba(180,140,90,0.35)",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                ...el.style,
              }}
            >
              <span>{STAMP_EMOJIS[i % STAMP_EMOJIS.length]}</span>
              <div style={{ width: "100%", height: 2, background: "rgba(180,120,90,0.15)", marginTop: 2 }} />
            </div>
          )
        }
        // emoji
        return (
          <div key={i} style={{ position: "absolute", ...el.style }}>
            {el.emoji}
          </div>
        )
      })}
    </div>
  )
}
