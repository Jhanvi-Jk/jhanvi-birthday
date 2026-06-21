import type { CakeShape, CakeOption } from "./types"

export const SHAPES: CakeOption[] = [
  { id: "heart",      label: "Heart",      emoji: "♡" },
  { id: "round",      label: "Round",      emoji: "○" },
  { id: "star",       label: "Star",       emoji: "⭐" },
  { id: "rectangle",  label: "Rectangle",  emoji: "▭" },
  { id: "two-tier",   label: "Two-Tier",   emoji: "🎂" },
  { id: "three-tier", label: "Three-Tier", emoji: "🎂" },
]

// All possible frosting colors
const ALL_FROSTINGS: CakeOption[] = [
  { id: "blush",     label: "Blush Pink",     color: "#F4A7B9" },
  { id: "lavender",  label: "Lavender",        color: "#C9B1E8" },
  { id: "cream",     label: "Vanilla Cream",   color: "#FFF5E1" },
  { id: "white",     label: "Snow White",      color: "#FAFAFA" },
  { id: "chocolate", label: "Chocolate",       color: "#7B4F2E" },
  { id: "sage",      label: "Sage Green",      color: "#B2C9AD" },
  { id: "dustyrose", label: "Dusty Rose",      color: "#D4A0A7" },
  { id: "gold",      label: "Gold",            color: "#D4AF37" },
  { id: "skyblue",   label: "Sky Blue",        color: "#AED6F1" },
  { id: "peach",     label: "Peach",           color: "#FFCBA4" },
  { id: "lilac",     label: "Lilac",           color: "#E8D5F5" },
  { id: "mint",      label: "Mint",            color: "#B5EAD7" },
]

// Shape → allowed frosting ids
const SHAPE_FROSTING_MAP: Record<CakeShape, string[]> = {
  heart:      ["blush", "lavender", "cream", "white", "dustyrose", "lilac", "peach"],
  round:      ALL_FROSTINGS.map(f => f.id),
  star:       ["gold", "lavender", "blush", "cream", "white", "skyblue", "lilac"],
  rectangle:  ALL_FROSTINGS.map(f => f.id),
  "two-tier": ["white", "cream", "blush", "dustyrose", "sage", "lavender", "gold"],
  "three-tier":["white", "cream", "gold", "blush", "lavender", "dustyrose"],
}

export function getFrostings(shape: CakeShape): CakeOption[] {
  const allowed = SHAPE_FROSTING_MAP[shape]
  return ALL_FROSTINGS.filter(f => allowed.includes(f.id))
}

// All possible decorations
const ALL_DECORATIONS: CakeOption[] = [
  { id: "flowers",    label: "Pressed Flowers",  emoji: "🌸" },
  { id: "pearls",     label: "Pearl Beads",       emoji: "○" },
  { id: "macarons",   label: "Macarons",          emoji: "🫐" },
  { id: "sprinkles",  label: "Sprinkles",         emoji: "✨" },
  { id: "cherries",   label: "Cherries",          emoji: "🍒" },
  { id: "strawberries",label: "Strawberries",     emoji: "🍓" },
  { id: "hearts",     label: "Tiny Hearts",       emoji: "♡" },
  { id: "stars",      label: "Gold Stars",        emoji: "⭐" },
  { id: "drizzle",    label: "Chocolate Drizzle", emoji: "🍫" },
  { id: "butterflies",label: "Butterflies",       emoji: "🦋" },
  { id: "goldleaf",   label: "Gold Leaf",         emoji: "🌿" },
  { id: "rosettes",   label: "Rosettes",          emoji: "🌹" },
]

// Frosting → incompatible decoration ids (clash badly)
const FROSTING_DECO_BLOCK: Record<string, string[]> = {
  chocolate: ["drizzle"],                          // double chocolate is fine actually — keep drizzle
  gold:      ["sprinkles", "cherries"],
  sage:      ["sprinkles", "hearts"],
  mint:      ["sprinkles"],
  white:     [],
  cream:     [],
  blush:     ["drizzle", "goldleaf"],
  lavender:  ["drizzle", "cherries", "strawberries"],
  dustyrose: ["drizzle"],
  skyblue:   ["drizzle", "cherries", "strawberries"],
  peach:     ["drizzle", "goldleaf"],
  lilac:     ["drizzle", "strawberries"],
}

export function getDecorations(shape: CakeShape, frosting: string): CakeOption[] {
  const blocked = FROSTING_DECO_BLOCK[frosting] ?? []
  // heart shape can't have very bold decos
  const shapeBlocked = shape === "heart" ? ["drizzle"] : []
  const allBlocked = new Set([...blocked, ...shapeBlocked])
  return ALL_DECORATIONS.filter(d => !allBlocked.has(d.id))
}

// All possible ribbons
const ALL_RIBBONS: CakeOption[] = [
  { id: "satin-blush",  label: "Blush Satin",    color: "#F4A7B9" },
  { id: "satin-white",  label: "White Satin",     color: "#FAFAFA" },
  { id: "velvet-berry", label: "Berry Velvet",    color: "#8B3A62" },
  { id: "gold-trim",    label: "Gold Trim",       color: "#D4AF37" },
  { id: "lace-ivory",   label: "Ivory Lace",      color: "#FFFFF0" },
  { id: "sage-ribbon",  label: "Sage Grosgrain",  color: "#B2C9AD" },
  { id: "lavender-ribbon",label:"Lavender Ribbon",color: "#C9B1E8" },
  { id: "dusty-ribbon", label: "Dusty Rose",      color: "#D4A0A7" },
]

// Frosting → ribbon color families that match
const FROSTING_RIBBON_MAP: Record<string, string[]> = {
  blush:      ["satin-blush", "satin-white", "lace-ivory", "gold-trim", "dusty-ribbon"],
  lavender:   ["lavender-ribbon", "satin-white", "lace-ivory", "gold-trim"],
  cream:      ["satin-white", "lace-ivory", "gold-trim", "satin-blush", "dusty-ribbon"],
  white:      ["satin-white", "gold-trim", "lace-ivory", "satin-blush", "lavender-ribbon"],
  chocolate:  ["velvet-berry", "gold-trim", "satin-white", "lace-ivory"],
  sage:       ["sage-ribbon", "satin-white", "lace-ivory", "gold-trim"],
  dustyrose:  ["dusty-ribbon", "satin-blush", "lace-ivory", "gold-trim"],
  gold:       ["gold-trim", "satin-white", "lace-ivory", "velvet-berry"],
  skyblue:    ["satin-white", "lace-ivory", "lavender-ribbon", "satin-blush"],
  peach:      ["satin-blush", "satin-white", "lace-ivory", "dusty-ribbon"],
  lilac:      ["lavender-ribbon", "satin-white", "lace-ivory", "satin-blush"],
  mint:       ["sage-ribbon", "satin-white", "lace-ivory"],
}

export function getRibbons(frosting: string): CakeOption[] {
  const allowed = FROSTING_RIBBON_MAP[frosting] ?? ALL_RIBBONS.map(r => r.id)
  return ALL_RIBBONS.filter(r => allowed.includes(r.id))
}

// All possible candle sets
const ALL_CANDLES: CakeOption[] = [
  { id: "pastel-mix",   label: "Pastel Mix",    color: "#FFD1DC" },
  { id: "gold-taper",   label: "Gold Tapers",   color: "#D4AF37" },
  { id: "white-thin",   label: "White Slim",    color: "#FAFAFA" },
  { id: "pink-spiral",  label: "Pink Spiral",   color: "#FF9EB5" },
  { id: "berry-short",  label: "Berry Short",   color: "#8B3A62" },
  { id: "lavender-star",label: "Lavender Stars",color: "#C9B1E8" },
  { id: "sage-taper",   label: "Sage Tapers",   color: "#B2C9AD" },
  { id: "cream-pearl",  label: "Cream & Pearl", color: "#FFF5E1" },
]

const FROSTING_CANDLE_MAP: Record<string, string[]> = {
  blush:      ["pastel-mix", "pink-spiral", "white-thin", "gold-taper", "cream-pearl"],
  lavender:   ["lavender-star", "white-thin", "pastel-mix", "cream-pearl"],
  cream:      ["cream-pearl", "white-thin", "gold-taper", "pastel-mix"],
  white:      ["white-thin", "gold-taper", "cream-pearl", "lavender-star", "pink-spiral"],
  chocolate:  ["gold-taper", "white-thin", "berry-short", "cream-pearl"],
  sage:       ["sage-taper", "white-thin", "cream-pearl", "gold-taper"],
  dustyrose:  ["pink-spiral", "pastel-mix", "white-thin", "gold-taper"],
  gold:       ["gold-taper", "white-thin", "cream-pearl"],
  skyblue:    ["white-thin", "lavender-star", "pastel-mix", "cream-pearl"],
  peach:      ["pastel-mix", "pink-spiral", "white-thin", "cream-pearl"],
  lilac:      ["lavender-star", "pastel-mix", "white-thin", "cream-pearl"],
  mint:       ["sage-taper", "white-thin", "pastel-mix", "cream-pearl"],
}

export function getCandles(frosting: string): CakeOption[] {
  const allowed = FROSTING_CANDLE_MAP[frosting] ?? ALL_CANDLES.map(c => c.id)
  return ALL_CANDLES.filter(c => allowed.includes(c.id))
}

export const SLOT_LABELS: Record<number, string> = {
  1: "Choose the cake shape",
  2: "Choose the frosting",
  3: "Add decorations",
  4: "Tie a ribbon",
  5: "Place the candles",
}

export const SLOTS_PER_CAKE = 5
