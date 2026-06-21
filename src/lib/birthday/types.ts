export type CakeShape = "heart" | "round" | "star" | "rectangle" | "two-tier" | "three-tier"

export type CakeSlot = 1 | 2 | 3 | 4 | 5
// 1 = shape, 2 = frosting, 3 = decoration, 4 = ribbon, 5 = candles

export interface CakeOption {
  id: string
  label: string
  emoji?: string
  color?: string        // hex for swatches
  incompatibleWith?: string[]  // ids of previous choices that block this
}

export interface Cake {
  id: string
  orderNum: number
  shape: CakeShape | null
  frostingColor: string | null
  decoration: string | null
  ribbon: string | null
  candles: string | null
  isComplete: boolean
  createdAt: string
}

export interface Contributor {
  id: string
  name: string
  cakeId: string
  slotNum: CakeSlot
  choice: string
  arrivalOrder: number
  createdAt: string
}

export interface Letter {
  id: string
  contributorId: string
  cakeId: string
  content: string
  createdAt: string
  contributor?: Contributor
}

export interface Memory {
  id: string
  contributorId: string
  content: string
  createdAt: string
}

export interface Word {
  id: string
  contributorId: string
  word: string
  createdAt: string
}

export interface Polaroid {
  id: string
  cakeId: string | null
  imageUrl: string | null
  caption: string | null
  posX: number
  posY: number
  rotation: number
  zIndex: number
}
