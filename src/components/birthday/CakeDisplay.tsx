"use client"

import type { Cake } from "@/lib/birthday/types"

interface CakeDisplayProps {
  cake: Partial<Cake>
  size?: number
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

const FROSTING_HEX: Record<string, string> = {
  blush:      "#F4A7B9",
  lavender:   "#C9B1E8",
  cream:      "#FFF5E1",
  white:      "#FAFAFA",
  chocolate:  "#7B4F2E",
  sage:       "#B2C9AD",
  dustyrose:  "#D4A0A7",
  gold:       "#D4AF37",
  skyblue:    "#AED6F1",
  peach:      "#FFCBA4",
  lilac:      "#E8D5F5",
  mint:       "#B5EAD7",
}

const RIBBON_HEX: Record<string, string> = {
  "satin-blush":    "#F4A7B9",
  "satin-white":    "#FAFAFA",
  "velvet-berry":   "#8B3A62",
  "gold-trim":      "#D4AF37",
  "lace-ivory":     "#FFFFF0",
  "sage-ribbon":    "#B2C9AD",
  "lavender-ribbon":"#C9B1E8",
  "dusty-ribbon":   "#D4A0A7",
}

const DECO_EMOJI: Record<string, string> = {
  flowers:      "🌸",
  pearls:       "⚪",
  macarons:     "🫐",
  sprinkles:    "✨",
  cherries:     "🍒",
  strawberries: "🍓",
  hearts:       "♡",
  stars:        "⭐",
  drizzle:      "〰",
  butterflies:  "🦋",
  goldleaf:     "🌿",
  rosettes:     "🌹",
}

const CANDLE_COLOR: Record<string, string> = {
  "pastel-mix":    "#FFD1DC",
  "gold-taper":    "#D4AF37",
  "white-thin":    "#F5F5F0",
  "pink-spiral":   "#FF9EB5",
  "berry-short":   "#8B3A62",
  "lavender-star": "#C9B1E8",
  "sage-taper":    "#B2C9AD",
  "cream-pearl":   "#FFF5E1",
}

function HeartPath({ size }: { size: number }) {
  const s = size
  return (
    <path
      d={`M${s/2},${s*0.35} C${s/2},${s*0.22} ${s*0.3},${s*0.14} ${s*0.18},${s*0.14} C${s*0.04},${s*0.14} ${s*0},${s*0.3} ${s*0},${s*0.4} C${s*0},${s*0.6} ${s/2},${s*0.82} ${s/2},${s*0.9} C${s/2},${s*0.82} ${s},${s*0.6} ${s},${s*0.4} C${s},${s*0.3} ${s*0.96},${s*0.14} ${s*0.82},${s*0.14} C${s*0.7},${s*0.14} ${s/2},${s*0.22} ${s/2},${s*0.35}Z`}
    />
  )
}

export default function CakeDisplay({ cake, size = 160, className = "", style, onClick }: CakeDisplayProps) {
  const s = size
  const frosting = cake.frostingColor ? FROSTING_HEX[cake.frostingColor] ?? "#FFF5E1" : "#EDE8DE"
  const ribbonColor = cake.ribbon ? RIBBON_HEX[cake.ribbon] ?? "#F4A7B9" : null
  const decoEmoji = cake.decoration ? DECO_EMOJI[cake.decoration] : null
  const candleColor = cake.candles ? CANDLE_COLOR[cake.candles] ?? "#FFD1DC" : null
  const shape = cake.shape ?? "round"

  // base color slightly darker than frosting
  const base = frosting === "#FAFAFA" ? "#ECECEC" : frosting + "CC"

  const isTiered = shape === "two-tier" || shape === "three-tier"

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={`cake-sticker ${className}`}
      style={style}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`shadow-${cake.id ?? "0"}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15"/>
        </filter>
        <linearGradient id={`frost-${cake.id ?? "0"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={frosting} stopOpacity="1"/>
          <stop offset="100%" stopColor={frosting} stopOpacity="0.85"/>
        </linearGradient>
      </defs>

      <g filter={`url(#shadow-${cake.id ?? "0"})`}>
        {shape === "heart" && (
          <>
            {/* Base plate */}
            <ellipse cx={s/2} cy={s*0.92} rx={s*0.34} ry={s*0.06} fill="rgba(0,0,0,0.08)"/>
            {/* Heart body */}
            <g transform={`translate(${s*0.08},${s*0.08})`}>
              <HeartPath size={s * 0.84} />
            </g>
            {/* Heart fill */}
            <g transform={`translate(${s*0.08},${s*0.08})`} fill={`url(#frost-${cake.id ?? "0"})`}>
              <HeartPath size={s * 0.84} />
            </g>
          </>
        )}

        {shape === "round" && (
          <>
            <ellipse cx={s/2} cy={s*0.92} rx={s*0.38} ry={s*0.07} fill="rgba(0,0,0,0.08)"/>
            {/* body */}
            <rect x={s*0.14} y={s*0.42} width={s*0.72} height={s*0.44} rx={s*0.04} fill={base}/>
            {/* frosting top */}
            <ellipse cx={s/2} cy={s*0.42} rx={s*0.36} ry={s*0.11} fill={`url(#frost-${cake.id ?? "0"})`}/>
            {/* frosting drip sides */}
            <rect x={s*0.14} y={s*0.42} width={s*0.72} height={s*0.12} rx={s*0.04} fill={frosting} opacity="0.7"/>
          </>
        )}

        {shape === "star" && (
          <>
            <ellipse cx={s/2} cy={s*0.92} rx={s*0.38} ry={s*0.07} fill="rgba(0,0,0,0.08)"/>
            <polygon
              points={`${s/2},${s*0.12} ${s*0.61},${s*0.38} ${s*0.9},${s*0.38} ${s*0.67},${s*0.56} ${s*0.76},${s*0.85} ${s/2},${s*0.68} ${s*0.24},${s*0.85} ${s*0.33},${s*0.56} ${s*0.1},${s*0.38} ${s*0.39},${s*0.38}`}
              fill={`url(#frost-${cake.id ?? "0"})`}
            />
          </>
        )}

        {shape === "rectangle" && (
          <>
            <ellipse cx={s/2} cy={s*0.92} rx={s*0.42} ry={s*0.06} fill="rgba(0,0,0,0.08)"/>
            <rect x={s*0.1} y={s*0.38} width={s*0.8} height={s*0.5} rx={s*0.02} fill={base}/>
            <rect x={s*0.1} y={s*0.38} width={s*0.8} height={s*0.14} rx={s*0.02} fill={frosting}/>
          </>
        )}

        {shape === "two-tier" && (
          <>
            <ellipse cx={s/2} cy={s*0.93} rx={s*0.4} ry={s*0.06} fill="rgba(0,0,0,0.08)"/>
            {/* bottom tier */}
            <rect x={s*0.12} y={s*0.56} width={s*0.76} height={s*0.34} rx={s*0.03} fill={base}/>
            <ellipse cx={s/2} cy={s*0.56} rx={s*0.38} ry={s*0.09} fill={frosting}/>
            {/* top tier */}
            <rect x={s*0.26} y={s*0.28} width={s*0.48} height={s*0.3} rx={s*0.03} fill={base}/>
            <ellipse cx={s/2} cy={s*0.28} rx={s*0.24} ry={s*0.07} fill={frosting}/>
          </>
        )}

        {shape === "three-tier" && (
          <>
            <ellipse cx={s/2} cy={s*0.94} rx={s*0.42} ry={s*0.05} fill="rgba(0,0,0,0.08)"/>
            {/* bottom */}
            <rect x={s*0.1} y={s*0.68} width={s*0.8} height={s*0.24} rx={s*0.02} fill={base}/>
            <ellipse cx={s/2} cy={s*0.68} rx={s*0.4} ry={s*0.07} fill={frosting}/>
            {/* middle */}
            <rect x={s*0.22} y={s*0.44} width={s*0.56} height={s*0.26} rx={s*0.02} fill={base}/>
            <ellipse cx={s/2} cy={s*0.44} rx={s*0.28} ry={s*0.06} fill={frosting}/>
            {/* top */}
            <rect x={s*0.33} y={s*0.24} width={s*0.34} height={s*0.22} rx={s*0.02} fill={base}/>
            <ellipse cx={s/2} cy={s*0.24} rx={s*0.17} ry={s*0.05} fill={frosting}/>
          </>
        )}

        {/* Ribbon */}
        {ribbonColor && shape !== "heart" && shape !== "star" && (
          <rect
            x={shape === "round" || shape === "rectangle" ? s * 0.14 : s * 0.12}
            y={shape === "two-tier" ? s * 0.69 : shape === "three-tier" ? s * 0.76 : s * 0.6}
            width={shape === "three-tier" ? s * 0.8 : shape === "two-tier" ? s * 0.76 : s * 0.72}
            height={5}
            rx={2}
            fill={ribbonColor}
            opacity={0.9}
          />
        )}
      </g>

      {/* Decoration emoji centered on top */}
      {decoEmoji && (
        <text
          x={s / 2}
          y={shape === "three-tier" ? s * 0.2 : shape === "two-tier" ? s * 0.24 : shape === "heart" ? s * 0.35 : s * 0.4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={s * 0.14}
        >
          {decoEmoji}
        </text>
      )}

      {/* Candles */}
      {candleColor && (
        <>
          {[s * 0.36, s / 2, s * 0.64].map((cx, i) => (
            <g key={i}>
              <rect
                x={cx - 3}
                y={shape === "three-tier" ? s * 0.14 : shape === "two-tier" ? s * 0.18 : s * 0.22}
                width={6}
                height={14}
                rx={2}
                fill={candleColor}
                stroke="rgba(0,0,0,0.08)"
                strokeWidth={0.5}
              />
              {/* flame */}
              <ellipse
                cx={cx}
                cy={shape === "three-tier" ? s * 0.11 : shape === "two-tier" ? s * 0.15 : s * 0.19}
                rx={3}
                ry={4.5}
                fill="#FFC85E"
                opacity={0.9}
              />
              <ellipse
                cx={cx}
                cy={shape === "three-tier" ? s * 0.12 : shape === "two-tier" ? s * 0.16 : s * 0.2}
                rx={1.5}
                ry={2.5}
                fill="#FF9A2E"
                opacity={0.7}
              />
            </g>
          ))}
        </>
      )}

      {/* Empty / in-progress indicator */}
      {!cake.isComplete && (
        <text
          x={s - 8}
          y={12}
          textAnchor="end"
          fontSize={9}
          fill="rgba(150,100,80,0.5)"
          fontFamily="'Caveat', cursive"
        >
          {cake.shape ? "building..." : "new ✦"}
        </text>
      )}
    </svg>
  )
}
