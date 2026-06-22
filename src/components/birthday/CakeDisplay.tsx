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
  blush: "#F4A7B9", lavender: "#C9B1E8", cream: "#FFF5E1",
  white: "#FAFAFA", chocolate: "#7B4F2E", sage: "#B2C9AD",
  dustyrose: "#D4A0A7", gold: "#D4AF37", skyblue: "#AED6F1",
  peach: "#FFCBA4", lilac: "#E8D5F5", mint: "#B5EAD7",
}

const RIBBON_HEX: Record<string, string> = {
  "satin-blush": "#F4A7B9", "satin-white": "#FAFAFA",
  "velvet-berry": "#8B3A62", "gold-trim": "#D4AF37",
  "lace-ivory": "#FFFFF0", "sage-ribbon": "#B2C9AD",
  "lavender-ribbon": "#C9B1E8", "dusty-ribbon": "#D4A0A7",
}

const DECO_EMOJI: Record<string, string> = {
  flowers: "🌸", pearls: "⚪", macarons: "🫐", sprinkles: "✨",
  cherries: "🍒", strawberries: "🍓", hearts: "♡", stars: "⭐",
  drizzle: "〰", butterflies: "🦋", goldleaf: "🌿", rosettes: "🌹",
}

const CANDLE_COLOR: Record<string, string> = {
  "pastel-mix": "#FFD1DC", "gold-taper": "#D4AF37", "white-thin": "#F5F5F0",
  "pink-spiral": "#FF9EB5", "berry-short": "#8B3A62", "lavender-star": "#C9B1E8",
  "sage-taper": "#B2C9AD", "cream-pearl": "#FFF5E1",
}

function darken(hex: string, amt: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.max(0, r - amt)},${Math.max(0, g - amt)},${Math.max(0, b - amt)})`
}

function lighten(hex: string, amt: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.min(255, r + amt)},${Math.min(255, g + amt)},${Math.min(255, b + amt)})`
}

// ── 3-D Cylindrical tier ────────────────────────────────────────────────────
function Tier({
  cx, topY, rx, ry, h, frosting, sGrad,
  showDrips, ribbonColor, ribbonY,
}: {
  cx: number; topY: number; rx: number; ry: number; h: number
  frosting: string; sGrad: string
  showDrips?: boolean; ribbonColor?: string | null; ribbonY?: number
}) {
  const dripXs = [0.16, 0.32, 0.50, 0.68, 0.84]
  const dripLens = [11, 7, 14, 8, 10]

  return (
    <g>
      {/* Back-bottom rim — gives cylinder depth */}
      <ellipse cx={cx} cy={topY + h} rx={rx} ry={ry * 0.72} fill={darken(frosting, 38)} />

      {/* Side body */}
      <rect x={cx - rx} y={topY} width={rx * 2} height={h} fill={darken(frosting, 18)} />

      {/* 3-D left-highlight / right-shadow gradient */}
      <rect x={cx - rx} y={topY} width={rx * 2} height={h} fill={`url(#${sGrad})`} />

      {/* Thin left highlight strip */}
      <rect x={cx - rx + 2} y={topY + ry} width={rx * 0.09} height={h - ry}
        fill="white" opacity={0.22} rx={2} />

      {/* Ribbon stripe */}
      {ribbonColor && ribbonY !== undefined && (
        <rect x={cx - rx} y={ribbonY} width={rx * 2} height={5}
          fill={ribbonColor} opacity={0.88} />
      )}

      {/* Frosting drips */}
      {showDrips && dripXs.map((frac, i) => {
        const dcx = cx - rx + rx * 2 * frac
        const dlen = dripLens[i]
        return (
          <g key={i}>
            <rect x={dcx - 3} y={topY + ry * 0.45} width={6} height={dlen}
              fill={frosting} opacity={0.88} />
            <ellipse cx={dcx} cy={topY + ry * 0.45 + dlen} rx={3.5} ry={2.8}
              fill={frosting} opacity={0.88} />
          </g>
        )
      })}

      {/* Top frosting ellipse */}
      <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill={frosting} />

      {/* Specular highlight on top */}
      <ellipse cx={cx - rx * 0.22} cy={topY - ry * 0.18}
        rx={rx * 0.32} ry={ry * 0.52} fill="white" opacity={0.38} />
    </g>
  )
}

// ── 3-D Candle ──────────────────────────────────────────────────────────────
function Candle({ cx, baseY, color, s }: { cx: number; baseY: number; color: string; s: number }) {
  const cw = s * 0.042
  const ch = s * 0.1
  return (
    <g>
      {/* Candle body */}
      <rect x={cx - cw / 2} y={baseY - ch} width={cw} height={ch} rx={cw / 2} fill={color} />
      {/* Left-light gradient */}
      <rect x={cx - cw / 2} y={baseY - ch} width={cw * 0.4} height={ch}
        rx={cw / 2} fill="white" opacity={0.35} />
      {/* Right shadow */}
      <rect x={cx + cw * 0.1} y={baseY - ch} width={cw * 0.4} height={ch}
        rx={0} fill="black" opacity={0.15} />
      {/* Candle top ellipse */}
      <ellipse cx={cx} cy={baseY - ch} rx={cw / 2} ry={cw * 0.22} fill={lighten(color, 30)} />
      {/* Wick */}
      <line x1={cx} y1={baseY - ch} x2={cx} y2={baseY - ch - s * 0.018}
        stroke="#4A3728" strokeWidth={1.2} />
      {/* Flame glow halo */}
      <ellipse cx={cx} cy={baseY - ch - s * 0.048}
        rx={s * 0.028} ry={s * 0.036} fill="#FFE07A" opacity={0.45} />
      {/* Flame body */}
      <path
        d={`M ${cx} ${baseY - ch - s * 0.07}
            C ${cx + s * 0.016} ${baseY - ch - s * 0.038}
              ${cx + s * 0.013} ${baseY - ch - s * 0.008}
              ${cx} ${baseY - ch - s * 0.002}
            C ${cx - s * 0.013} ${baseY - ch - s * 0.008}
              ${cx - s * 0.016} ${baseY - ch - s * 0.038}
              ${cx} ${baseY - ch - s * 0.07} Z`}
        fill="#FFC85E"
      />
      {/* Inner bright core */}
      <ellipse cx={cx} cy={baseY - ch - s * 0.03}
        rx={s * 0.008} ry={s * 0.02} fill="#FF9A2E" opacity={0.8} />
    </g>
  )
}

export default function CakeDisplay({ cake, size = 160, className = "", style, onClick }: CakeDisplayProps) {
  const s = size
  const frosting = cake.frostingColor ? FROSTING_HEX[cake.frostingColor] ?? "#F4A7B9" : "#E8C8B8"
  const ribbonColor = cake.ribbon ? RIBBON_HEX[cake.ribbon] ?? null : null
  const decoEmoji = cake.decoration ? DECO_EMOJI[cake.decoration] : null
  const candleColor = cake.candles ? CANDLE_COLOR[cake.candles] ?? "#FFD1DC" : null
  const shape = cake.shape ?? "round"

  // Stable uid from cake id (strip non-alphanumeric to keep valid SVG id)
  const uid = String(cake.id ?? "prev").replace(/[^a-z0-9]/gi, "x")

  const sGrad = `sg-${uid}`
  const rGrad = `rg-${uid}`

  // Shared heart path
  const heartD = `M${s / 2},${s * 0.35} C${s / 2},${s * 0.22} ${s * 0.3},${s * 0.14} ${s * 0.18},${s * 0.14} C${s * 0.04},${s * 0.14} 0,${s * 0.3} 0,${s * 0.4} C0,${s * 0.6} ${s / 2},${s * 0.82} ${s / 2},${s * 0.9} C${s / 2},${s * 0.82} ${s},${s * 0.6} ${s},${s * 0.4} C${s},${s * 0.3} ${s * 0.96},${s * 0.14} ${s * 0.82},${s * 0.14} C${s * 0.7},${s * 0.14} ${s / 2},${s * 0.22} ${s / 2},${s * 0.35}Z`

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
        {/* Horizontal side-shading gradient: left highlight → right shadow */}
        <linearGradient id={sGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0.48" />
          <stop offset="18%"  stopColor="white" stopOpacity="0.04" />
          <stop offset="74%"  stopColor="black" stopOpacity="0"    />
          <stop offset="100%" stopColor="black" stopOpacity="0.28" />
        </linearGradient>
        {/* Radial top highlight */}
        <radialGradient id={rGrad} cx="38%" cy="35%" r="58%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.38" />
          <stop offset="100%" stopColor={darken(frosting, 8)} stopOpacity="0.12" />
        </radialGradient>
      </defs>

      {/* ── ROUND ────────────────────────────────────────────────────── */}
      {shape === "round" && (() => {
        const cx = s / 2, rx = s * 0.34, ry = s * 0.09, topY = s * 0.40, h = s * 0.36
        return (
          <>
            {/* Ground shadow */}
            <ellipse cx={cx} cy={topY + h + ry * 0.7} rx={rx + 5} ry={s * 0.052} fill="rgba(0,0,0,0.13)" />
            <Tier cx={cx} topY={topY} rx={rx} ry={ry} h={h} frosting={frosting} sGrad={sGrad}
              showDrips ribbonColor={ribbonColor} ribbonY={ribbonColor ? topY + h * 0.62 : undefined} />
            {candleColor && [s * 0.35, s * 0.5, s * 0.65].map((cx2, i) => (
              <Candle key={i} cx={cx2} baseY={topY} color={candleColor} s={s} />
            ))}
            {decoEmoji && (
              <text x={cx} y={topY - ry * 0.2} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.16}>{decoEmoji}</text>
            )}
          </>
        )
      })()}

      {/* ── HEART ────────────────────────────────────────────────────── */}
      {shape === "heart" && (() => (
        <>
          {/* Drop shadow */}
          <path d={heartD} fill="rgba(0,0,0,0.1)" transform="translate(0,9)" />
          {/* Depth layer (darker, offset) */}
          <path d={heartD} fill={darken(frosting, 28)} transform="translate(0,5)" />
          {/* Main fill */}
          <path d={heartD} fill={frosting} />
          {/* Side gradient shading */}
          <path d={heartD} fill={`url(#${sGrad})`} opacity={0.65} />
          {/* Top radial highlight */}
          <path d={heartD} fill={`url(#${rGrad})`} opacity={0.8} />
          {/* Specular shine spot */}
          <ellipse cx={s * 0.36} cy={s * 0.28} rx={s * 0.09} ry={s * 0.07} fill="white" opacity={0.35} />
          {decoEmoji && (
            <text x={s / 2} y={s * 0.54} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.18}>{decoEmoji}</text>
          )}
          {candleColor && [s * 0.36, s * 0.5, s * 0.64].map((cx2, i) => (
            <Candle key={i} cx={cx2} baseY={s * 0.3} color={candleColor} s={s} />
          ))}
        </>
      ))()}

      {/* ── STAR ─────────────────────────────────────────────────────── */}
      {shape === "star" && (() => {
        const pts = `${s/2},${s*0.10} ${s*0.61},${s*0.36} ${s*0.91},${s*0.36} ${s*0.68},${s*0.55} ${s*0.78},${s*0.85} ${s/2},${s*0.67} ${s*0.22},${s*0.85} ${s*0.32},${s*0.55} ${s*0.09},${s*0.36} ${s*0.39},${s*0.36}`
        return (
          <>
            <polygon points={pts} fill="rgba(0,0,0,0.10)" transform="translate(0,8)" />
            <polygon points={pts} fill={darken(frosting, 22)} transform="translate(0,5)" />
            <polygon points={pts} fill={frosting} />
            <polygon points={pts} fill={`url(#${sGrad})`} opacity={0.58} />
            <polygon points={pts} fill={`url(#${rGrad})`} opacity={0.75} />
            <ellipse cx={s * 0.42} cy={s * 0.28} rx={s * 0.08} ry={s * 0.06} fill="white" opacity={0.38} />
            {decoEmoji && (
              <text x={s / 2} y={s * 0.52} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.17}>{decoEmoji}</text>
            )}
            {candleColor && (
              <Candle cx={s / 2} baseY={s * 0.20} color={candleColor} s={s} />
            )}
          </>
        )
      })()}

      {/* ── RECTANGLE (sheet cake) ───────────────────────────────────── */}
      {shape === "rectangle" && (() => {
        const lx = s * 0.07, ty = s * 0.36, w = s * 0.86, h = s * 0.42, topH = s * 0.11
        return (
          <>
            {/* Ground shadow */}
            <ellipse cx={lx + w / 2} cy={ty + h + s * 0.035} rx={w / 2 + 3} ry={s * 0.046} fill="rgba(0,0,0,0.13)" />
            {/* Back side */}
            <rect x={lx} y={ty} width={w} height={h} rx={3} fill={darken(frosting, 30)} />
            {/* Main body */}
            <rect x={lx} y={ty} width={w} height={h} rx={3} fill={darken(frosting, 16)} />
            {/* 3D gradient */}
            <rect x={lx} y={ty} width={w} height={h} rx={3} fill={`url(#${sGrad})`} />
            {/* Top frosting face */}
            <rect x={lx} y={ty} width={w} height={topH} rx={3} fill={frosting} />
            {/* Top radial highlight */}
            <rect x={lx} y={ty} width={w} height={topH} rx={3} fill={`url(#${rGrad})`} opacity={0.9} />
            {/* Left strip */}
            <rect x={lx + 2} y={ty + topH} width={w * 0.07} height={h - topH} fill="white" opacity={0.18} rx={2} />
            {/* Ribbon */}
            {ribbonColor && <rect x={lx} y={ty + h * 0.58} width={w} height={5} fill={ribbonColor} opacity={0.88} />}
            {decoEmoji && (
              <text x={lx + w / 2} y={ty + topH * 0.55} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.13}>{decoEmoji}</text>
            )}
            {candleColor && [s * 0.28, s * 0.5, s * 0.72].map((cx2, i) => (
              <Candle key={i} cx={cx2} baseY={ty} color={candleColor} s={s} />
            ))}
          </>
        )
      })()}

      {/* ── TWO-TIER ─────────────────────────────────────────────────── */}
      {shape === "two-tier" && (() => {
        const bot = { cx: s / 2, rx: s * 0.36, ry: s * 0.088, topY: s * 0.53, h: s * 0.30 }
        const top = { cx: s / 2, rx: s * 0.23, ry: s * 0.062, topY: s * 0.26, h: s * 0.28 }
        return (
          <>
            <ellipse cx={s / 2} cy={bot.topY + bot.h + bot.ry * 0.7} rx={bot.rx + 5} ry={s * 0.048} fill="rgba(0,0,0,0.13)" />
            <Tier {...bot} frosting={frosting} sGrad={sGrad} showDrips
              ribbonColor={ribbonColor} ribbonY={ribbonColor ? bot.topY + bot.h * 0.62 : undefined} />
            {/* Separator plate */}
            <ellipse cx={s / 2} cy={top.topY + top.h} rx={top.rx + 5} ry={top.ry * 0.55} fill={darken(frosting, 42)} />
            <Tier {...top} frosting={frosting} sGrad={sGrad} showDrips />
            {candleColor && [s * 0.41, s * 0.5, s * 0.59].map((cx2, i) => (
              <Candle key={i} cx={cx2} baseY={top.topY} color={candleColor} s={s} />
            ))}
            {decoEmoji && (
              <text x={s / 2} y={top.topY - top.ry * 0.3} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.13}>{decoEmoji}</text>
            )}
          </>
        )
      })()}

      {/* ── THREE-TIER ───────────────────────────────────────────────── */}
      {shape === "three-tier" && (() => {
        const bot = { cx: s / 2, rx: s * 0.38, ry: s * 0.08, topY: s * 0.64, h: s * 0.24 }
        const mid = { cx: s / 2, rx: s * 0.26, ry: s * 0.064, topY: s * 0.40, h: s * 0.25 }
        const top = { cx: s / 2, rx: s * 0.16, ry: s * 0.048, topY: s * 0.20, h: s * 0.21 }
        return (
          <>
            <ellipse cx={s / 2} cy={bot.topY + bot.h + bot.ry * 0.7} rx={bot.rx + 4} ry={s * 0.042} fill="rgba(0,0,0,0.13)" />
            <Tier {...bot} frosting={frosting} sGrad={sGrad} showDrips
              ribbonColor={ribbonColor} ribbonY={ribbonColor ? bot.topY + bot.h * 0.62 : undefined} />
            <ellipse cx={s / 2} cy={mid.topY + mid.h} rx={mid.rx + 4} ry={mid.ry * 0.55} fill={darken(frosting, 42)} />
            <Tier {...mid} frosting={frosting} sGrad={sGrad} showDrips />
            <ellipse cx={s / 2} cy={top.topY + top.h} rx={top.rx + 3} ry={top.ry * 0.55} fill={darken(frosting, 42)} />
            <Tier {...top} frosting={frosting} sGrad={sGrad} showDrips />
            {candleColor && (
              <Candle cx={s / 2} baseY={top.topY} color={candleColor} s={s} />
            )}
            {decoEmoji && (
              <text x={s / 2} y={top.topY - top.ry * 0.3} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.1}>{decoEmoji}</text>
            )}
          </>
        )
      })()}

      {/* Building indicator */}
      {!cake.isComplete && (
        <text x={s - 6} y={11} textAnchor="end" fontSize={9}
          fill="rgba(150,100,80,0.45)" fontFamily="'Caveat',cursive">
          {cake.shape ? "building..." : "new ✦"}
        </text>
      )}
    </svg>
  )
}
