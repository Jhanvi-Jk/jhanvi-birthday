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

// ── Color helpers ────────────────────────────────────────────────────────────
function darken(hex: string, amt: number): string {
  if (!hex.startsWith("#") || hex.length < 7) return hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`
}
function lighten(hex: string, amt: number): string {
  if (!hex.startsWith("#") || hex.length < 7) return hex
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`
}

// Ganache drip color — dark version of the frosting
function dripOf(hex: string, id?: string): string {
  if (id === "chocolate") return "#180800"
  if (id === "gold")      return "#6B4400"
  if (id === "sage")      return "#3A5A34"
  return darken(hex, 72)
}

// Cake sponge body color
function spongeOf(id?: string): string {
  return id === "chocolate" ? "#8B4A28" : "#E4CFA0"
}

// ── Piped rosette (layered circles → looks like piped cream swirl) ───────────
function Rosette({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <circle cx={cx} cy={cy - r * 0.14} r={r * 0.62} fill={darken(color, 18)} />
      <circle cx={cx - r * 0.18} cy={cy - r * 0.26} r={r * 0.3} fill={darken(color, 30)} />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.38} r={r * 0.14} fill="white" opacity={0.32} />
    </g>
  )
}

// ── 3-D Candle ───────────────────────────────────────────────────────────────
function Candle({ cx, baseY, color, s }: { cx: number; baseY: number; color: string; s: number }) {
  const cw = s * 0.042, ch = s * 0.095
  return (
    <g>
      <rect x={cx - cw / 2} y={baseY - ch} width={cw} height={ch} rx={cw / 2} fill={color} />
      <rect x={cx - cw / 2} y={baseY - ch} width={cw * 0.38} height={ch} rx={cw / 2} fill="white" opacity={0.3} />
      <ellipse cx={cx} cy={baseY - ch} rx={cw / 2} ry={cw * 0.22} fill={lighten(color, 28)} />
      <line x1={cx} y1={baseY - ch} x2={cx} y2={baseY - ch - s * 0.018} stroke="#4A3728" strokeWidth={1.2} />
      <ellipse cx={cx} cy={baseY - ch - s * 0.046} rx={s * 0.026} ry={s * 0.033} fill="#FFE07A" opacity={0.4} />
      <path
        d={`M ${cx} ${baseY-ch-s*0.068} C ${cx+s*0.016} ${baseY-ch-s*0.036} ${cx+s*0.012} ${baseY-ch-s*0.006} ${cx} ${baseY-ch-s*0.001} C ${cx-s*0.012} ${baseY-ch-s*0.006} ${cx-s*0.016} ${baseY-ch-s*0.036} ${cx} ${baseY-ch-s*0.068}Z`}
        fill="#FFC85E"
      />
      <ellipse cx={cx} cy={baseY - ch - s * 0.03} rx={s * 0.008} ry={s * 0.019} fill="#FF9A2E" opacity={0.78} />
    </g>
  )
}

// ── Ganache drip tier (the main 3-D cake element) ────────────────────────────
// Renders ONE cylindrical tier with: sponge body, ganache drips, top cap, rosettes, base piping
function DripTier({
  cx, topY, rx, ry, h,
  frosting, drip, sponge, sGrad,
  showTopRosettes = true,
  showBasePiping = true,
  ribbonColor,
}: {
  cx: number; topY: number; rx: number; ry: number; h: number
  frosting: string; drip: string; sponge: string; sGrad: string
  showTopRosettes?: boolean; showBasePiping?: boolean
  ribbonColor?: string | null
}) {
  // Drip positions [xFraction, heightFraction]
  const DRIPS = [
    [0.07, 0.56], [0.17, 0.38], [0.27, 0.74], [0.37, 0.44],
    [0.50, 0.70], [0.63, 0.36], [0.73, 0.62], [0.83, 0.42], [0.93, 0.54],
  ]
  const dr = rx * 0.042

  const rotCount = 7, rotR = rx * 0.69, rotRY = ry * 0.72, rotRad = rx * 0.115
  const pipeCount = 9, pipeR = rx * 0.092

  return (
    <g>
      {/* Back-bottom rim for depth */}
      <ellipse cx={cx} cy={topY + h} rx={rx} ry={ry * 0.72} fill={darken(sponge, 30)} />

      {/* Cake sponge body */}
      <rect x={cx - rx} y={topY} width={rx * 2} height={h} fill={sponge} />
      {/* 3-D side gradient (left highlight, right shadow) */}
      <rect x={cx - rx} y={topY} width={rx * 2} height={h} fill={`url(#${sGrad})`} />

      {/* Ganache coat band at top of tier */}
      <rect x={cx - rx} y={topY} width={rx * 2} height={Math.min(ry * 2, h * 0.22)} fill={drip} opacity={0.94} />

      {/* Drips */}
      {DRIPS.map(([frac, lenFrac], i) => {
        const dcx = (cx - rx) + rx * 2 * frac
        const dlen = h * lenFrac
        return (
          <g key={i}>
            <rect x={dcx - dr} y={topY + ry * 0.52} width={dr * 2} height={dlen} rx={dr} fill={drip} />
            <circle cx={dcx} cy={topY + ry * 0.52 + dlen} r={dr * 1.28} fill={drip} />
          </g>
        )
      })}

      {/* Subtle left-edge highlight strip */}
      <rect x={cx - rx + 2} y={topY + ry} width={rx * 0.07} height={h - ry} fill="white" opacity={0.12} rx={2} />

      {/* Base piping rosettes along the bottom front arc */}
      {showBasePiping && Array.from({ length: pipeCount }, (_, i) => {
        const angle = Math.PI - (i / (pipeCount - 1)) * Math.PI
        const px = cx + (rx - pipeR * 0.4) * Math.cos(angle)
        const py = (topY + h) + ry * 0.78 * Math.sin(angle)
        return <Rosette key={i} cx={px} cy={py} r={pipeR} color={frosting} />
      })}

      {/* Ribbon stripe */}
      {ribbonColor && (
        <rect x={cx - rx} y={topY + h * 0.53} width={rx * 2} height={5} fill={ribbonColor} opacity={0.9} />
      )}

      {/* Top ganache cap ellipse */}
      <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill={drip} />

      {/* Top rosettes in a ring */}
      {showTopRosettes && Array.from({ length: rotCount }, (_, i) => {
        const angle = (i / rotCount) * Math.PI * 2
        const px = cx + rotR * Math.cos(angle)
        const py = topY + rotRY * Math.sin(angle)
        return <Rosette key={i} cx={px} cy={py} r={rotRad} color={frosting} />
      })}
      {/* Center top rosette */}
      {showTopRosettes && <Rosette cx={cx} cy={topY} r={rotRad * 1.18} color={frosting} />}

      {/* Specular highlight on top */}
      <ellipse cx={cx - rx * 0.22} cy={topY - ry * 0.2} rx={rx * 0.28} ry={ry * 0.44} fill="white" opacity={0.24} />
    </g>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CakeDisplay({ cake, size = 160, className = "", style, onClick }: CakeDisplayProps) {
  const s = size
  const frosting    = cake.frostingColor ? FROSTING_HEX[cake.frostingColor] ?? "#F4A7B9" : "#F4A7B9"
  const ribbonColor = cake.ribbon ? RIBBON_HEX[cake.ribbon] ?? null : null
  const decoEmoji   = cake.decoration ? DECO_EMOJI[cake.decoration] : null
  const candleColor = cake.candles ? CANDLE_COLOR[cake.candles] ?? "#FFD1DC" : null
  const shape       = cake.shape ?? "round"

  const uid    = String(cake.id ?? "prev").replace(/[^a-z0-9]/gi, "x")
  const sGrad  = `sg-${uid}`
  const drip   = dripOf(frosting, cake.frostingColor ?? undefined)
  const sponge = spongeOf(cake.frostingColor ?? undefined)

  // Heart path
  const heartD = `M${s/2},${s*0.35} C${s/2},${s*0.22} ${s*0.3},${s*0.14} ${s*0.18},${s*0.14} C${s*0.04},${s*0.14} 0,${s*0.3} 0,${s*0.4} C0,${s*0.6} ${s/2},${s*0.82} ${s/2},${s*0.9} C${s/2},${s*0.82} ${s},${s*0.6} ${s},${s*0.4} C${s},${s*0.3} ${s*0.96},${s*0.14} ${s*0.82},${s*0.14} C${s*0.7},${s*0.14} ${s/2},${s*0.22} ${s/2},${s*0.35}Z`

  return (
    <svg
      width={s} height={s} viewBox={`0 0 ${s} ${s}`}
      className={`cake-sticker ${className}`}
      style={style} onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Horizontal 3-D shading: left highlight → right shadow */}
        <linearGradient id={sGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0.46" />
          <stop offset="16%"  stopColor="white" stopOpacity="0.04" />
          <stop offset="74%"  stopColor="black" stopOpacity="0"    />
          <stop offset="100%" stopColor="black" stopOpacity="0.28" />
        </linearGradient>
        {/* Heart/star radial shading */}
        <radialGradient id={`rg-${uid}`} cx="36%" cy="34%" r="58%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.36" />
          <stop offset="100%" stopColor={darken(frosting, 8)} stopOpacity="0.12" />
        </radialGradient>
      </defs>

      {/* ── ROUND ──────────────────────────────────────────────────── */}
      {shape === "round" && (() => {
        const cx = s / 2, rx = s * 0.34, ry = s * 0.09, topY = s * 0.40, h = s * 0.36
        return (
          <>
            {/* Ground shadow */}
            <ellipse cx={cx} cy={topY + h + ry * 0.75} rx={rx + 6} ry={s * 0.05} fill="rgba(0,0,0,0.15)" />
            <DripTier cx={cx} topY={topY} rx={rx} ry={ry} h={h}
              frosting={frosting} drip={drip} sponge={sponge} sGrad={sGrad}
              ribbonColor={ribbonColor} />
            {candleColor && [s * 0.35, s * 0.5, s * 0.65].map((cx2, i) => (
              <Candle key={i} cx={cx2} baseY={topY - s * 0.09} color={candleColor} s={s} />
            ))}
            {decoEmoji && (
              <text x={cx} y={topY - ry * 0.55} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.14}>{decoEmoji}</text>
            )}
          </>
        )
      })()}

      {/* ── TWO-TIER ───────────────────────────────────────────────── */}
      {shape === "two-tier" && (() => {
        const bot = { cx: s/2, rx: s*0.36, ry: s*0.088, topY: s*0.52, h: s*0.30 }
        const top = { cx: s/2, rx: s*0.23, ry: s*0.060, topY: s*0.26, h: s*0.27 }
        return (
          <>
            <ellipse cx={s/2} cy={bot.topY+bot.h+bot.ry*0.75} rx={bot.rx+6} ry={s*0.047} fill="rgba(0,0,0,0.14)" />
            <DripTier {...bot} frosting={frosting} drip={drip} sponge={sponge} sGrad={sGrad}
              showTopRosettes={false} ribbonColor={ribbonColor} />
            {/* Tier separator plate */}
            <ellipse cx={s/2} cy={top.topY+top.h} rx={top.rx+6} ry={top.ry*0.6} fill={darken(sponge, 30)} />
            <DripTier {...top} frosting={frosting} drip={drip} sponge={sponge} sGrad={sGrad} />
            {candleColor && [s*0.41, s*0.5, s*0.59].map((cx2, i) => (
              <Candle key={i} cx={cx2} baseY={top.topY - s*0.06} color={candleColor} s={s} />
            ))}
            {decoEmoji && (
              <text x={s/2} y={top.topY - top.ry*0.55} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.12}>{decoEmoji}</text>
            )}
          </>
        )
      })()}

      {/* ── THREE-TIER ─────────────────────────────────────────────── */}
      {shape === "three-tier" && (() => {
        const bot = { cx: s/2, rx: s*0.38, ry: s*0.082, topY: s*0.63, h: s*0.24 }
        const mid = { cx: s/2, rx: s*0.26, ry: s*0.062, topY: s*0.40, h: s*0.24 }
        const top = { cx: s/2, rx: s*0.16, ry: s*0.046, topY: s*0.20, h: s*0.21 }
        return (
          <>
            <ellipse cx={s/2} cy={bot.topY+bot.h+bot.ry*0.75} rx={bot.rx+5} ry={s*0.042} fill="rgba(0,0,0,0.14)" />
            <DripTier {...bot} frosting={frosting} drip={drip} sponge={sponge} sGrad={sGrad}
              showTopRosettes={false} ribbonColor={ribbonColor} />
            <ellipse cx={s/2} cy={mid.topY+mid.h} rx={mid.rx+5} ry={mid.ry*0.6} fill={darken(sponge,30)} />
            <DripTier {...mid} frosting={frosting} drip={drip} sponge={sponge} sGrad={sGrad}
              showTopRosettes={false} />
            <ellipse cx={s/2} cy={top.topY+top.h} rx={top.rx+4} ry={top.ry*0.6} fill={darken(sponge,30)} />
            <DripTier {...top} frosting={frosting} drip={drip} sponge={sponge} sGrad={sGrad} />
            {candleColor && <Candle cx={s/2} baseY={top.topY - s*0.045} color={candleColor} s={s} />}
            {decoEmoji && (
              <text x={s/2} y={top.topY - top.ry*0.6} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.1}>{decoEmoji}</text>
            )}
          </>
        )
      })()}

      {/* ── RECTANGLE (sheet cake with drip front) ─────────────────── */}
      {shape === "rectangle" && (() => {
        const lx = s*0.07, ty = s*0.34, w = s*0.86, h = s*0.42, topH = s*0.095
        const DRIPS = [[0.07,0.55],[0.19,0.38],[0.30,0.70],[0.42,0.44],[0.54,0.68],[0.66,0.36],[0.78,0.58],[0.90,0.42]]
        const dr = w * 0.024
        // Base piping (front bottom)
        const pipeCount = 10, pipeR = w * 0.048
        return (
          <>
            <ellipse cx={lx+w/2} cy={ty+h+s*0.035} rx={w/2+4} ry={s*0.043} fill="rgba(0,0,0,0.14)" />
            {/* Sponge body */}
            <rect x={lx} y={ty} width={w} height={h} rx={3} fill={sponge} />
            <rect x={lx} y={ty} width={w} height={h} rx={3} fill={`url(#${sGrad})`} />
            {/* Ganache coat top band */}
            <rect x={lx} y={ty} width={w} height={topH} rx={3} fill={drip} opacity={0.94} />
            {/* Drips */}
            {DRIPS.map(([frac, lenFrac], i) => {
              const dcx = lx + w*frac
              const dlen = h * lenFrac
              return (
                <g key={i}>
                  <rect x={dcx-dr} y={ty+topH*0.6} width={dr*2} height={dlen} rx={dr} fill={drip}/>
                  <circle cx={dcx} cy={ty+topH*0.6+dlen} r={dr*1.28} fill={drip}/>
                </g>
              )
            })}
            {/* Left highlight strip */}
            <rect x={lx+2} y={ty+topH} width={w*0.06} height={h-topH} fill="white" opacity={0.12} rx={2}/>
            {/* Base piping */}
            {Array.from({length: pipeCount}, (_, i) => {
              const px = lx + pipeR*0.5 + (i/(pipeCount-1))*(w - pipeR)
              const py = ty + h + pipeR * 0.3
              return <Rosette key={i} cx={px} cy={py} r={pipeR} color={frosting}/>
            })}
            {/* Ribbon */}
            {ribbonColor && <rect x={lx} y={ty+h*0.53} width={w} height={5} fill={ribbonColor} opacity={0.9}/>}
            {/* Top ganache face */}
            <rect x={lx} y={ty} width={w} height={topH} rx={3} fill={drip}/>
            {/* Top rosettes row */}
            {Array.from({length: 5}, (_, i) => {
              const px = lx + (i+0.5)*(w/5)
              return <Rosette key={i} cx={px} cy={ty + topH*0.5} r={topH*0.55} color={frosting}/>
            })}
            {decoEmoji && <text x={lx+w/2} y={ty+topH*0.5} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.11}>{decoEmoji}</text>}
            {candleColor && [s*0.28, s*0.50, s*0.72].map((cx2, i) => (
              <Candle key={i} cx={cx2} baseY={ty - s*0.01} color={candleColor} s={s} />
            ))}
          </>
        )
      })()}

      {/* ── HEART (extruded 3-D with rosettes) ────────────────────── */}
      {shape === "heart" && (() => (
        <>
          {/* Drop shadow */}
          <path d={heartD} fill="rgba(0,0,0,0.10)" transform="translate(0,10)" />
          {/* Depth extrusion (side face) */}
          <path d={heartD} fill={darken(sponge, 20)} transform="translate(0,6)" />
          <path d={heartD} fill={sponge} transform="translate(0,2)" />
          {/* Main top face */}
          <path d={heartD} fill={frosting} />
          {/* 3-D gradient shading */}
          <path d={heartD} fill={`url(#${sGrad})`} opacity={0.6} />
          <path d={heartD} fill={`url(#rg-${uid})`} opacity={0.75} />
          {/* Specular shine */}
          <ellipse cx={s*0.34} cy={s*0.26} rx={s*0.09} ry={s*0.07} fill="white" opacity={0.36} />
          {/* Rosettes scattered on top */}
          {[
            [s*0.3, s*0.38], [s*0.5, s*0.30], [s*0.7, s*0.38],
            [s*0.22, s*0.54], [s*0.5, s*0.55], [s*0.78, s*0.54],
          ].map(([rx2, ry2], i) => (
            <Rosette key={i} cx={rx2} cy={ry2} r={s * 0.06} color={frosting} />
          ))}
          {decoEmoji && <text x={s/2} y={s*0.54} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.18}>{decoEmoji}</text>}
          {candleColor && [s*0.36, s*0.5, s*0.64].map((cx2, i) => (
            <Candle key={i} cx={cx2} baseY={s*0.24} color={candleColor} s={s} />
          ))}
        </>
      ))()}

      {/* ── STAR (extruded 3-D with center rosette) ────────────────── */}
      {shape === "star" && (() => {
        const pts = `${s/2},${s*0.10} ${s*0.61},${s*0.36} ${s*0.91},${s*0.36} ${s*0.68},${s*0.55} ${s*0.78},${s*0.85} ${s/2},${s*0.67} ${s*0.22},${s*0.85} ${s*0.32},${s*0.55} ${s*0.09},${s*0.36} ${s*0.39},${s*0.36}`
        return (
          <>
            <polygon points={pts} fill="rgba(0,0,0,0.10)" transform="translate(0,9)" />
            <polygon points={pts} fill={darken(sponge, 20)} transform="translate(0,5)" />
            <polygon points={pts} fill={sponge} transform="translate(0,2)" />
            <polygon points={pts} fill={frosting} />
            <polygon points={pts} fill={`url(#${sGrad})`} opacity={0.58} />
            <polygon points={pts} fill={`url(#rg-${uid})`} opacity={0.72} />
            <ellipse cx={s*0.4} cy={s*0.28} rx={s*0.08} ry={s*0.06} fill="white" opacity={0.36} />
            {/* Rosettes at star tips and center */}
            {[
              [s/2, s*0.17], [s*0.74, s*0.42], [s*0.26, s*0.42], [s/2, s*0.5],
            ].map(([rx2, ry2], i) => (
              <Rosette key={i} cx={rx2} cy={ry2} r={s * 0.063} color={frosting} />
            ))}
            {decoEmoji && <text x={s/2} y={s*0.52} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.16}>{decoEmoji}</text>}
            {candleColor && <Candle cx={s/2} baseY={s*0.12} color={candleColor} s={s} />}
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
