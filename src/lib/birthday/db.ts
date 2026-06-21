import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { SLOTS_PER_CAKE } from "./cake-options"

function createPrisma() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter } as never)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma: any }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma: any = globalForPrisma.prisma ?? createPrisma()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Returns the current open cake (not complete) or creates the first one
export async function getOrCreateActiveCake() {
  let cake = await prisma.birthdayCake.findFirst({
    where: { isComplete: false },
    orderBy: { orderNum: "asc" },
  })
  if (!cake) {
    const last = await prisma.birthdayCake.findFirst({ orderBy: { orderNum: "desc" } })
    cake = await prisma.birthdayCake.create({
      data: { orderNum: (last?.orderNum ?? 0) + 1 },
    })
  }
  return cake
}

// How many contributors are already on the active cake
export async function getActiveCakeSlotNum(cakeId: string): Promise<number> {
  const count = await prisma.birthdayContributor.count({ where: { cakeId } })
  return count + 1 // next slot
}

// Global arrival order
export async function getNextArrivalOrder(): Promise<number> {
  const count = await prisma.birthdayContributor.count()
  return count + 1
}

export async function getAllCakes() {
  return prisma.birthdayCake.findMany({
    orderBy: { orderNum: "asc" },
    include: {
      contributors: { orderBy: { slotNum: "asc" } },
      letters: { include: { contributor: true } },
      polaroids: true,
    },
  })
}

export async function getMemories() {
  return prisma.birthdayMemory.findMany({ orderBy: { createdAt: "asc" } })
}

export async function getWords() {
  return prisma.birthdayWord.findMany({ orderBy: { createdAt: "asc" } })
}

export async function getPolaroids() {
  return prisma.birthdayPolaroid.findMany({ orderBy: { zIndex: "asc" } })
}

// Mark cake complete if all 5 slots filled
export async function maybeCompleteCake(cakeId: string) {
  const count = await prisma.birthdayContributor.count({ where: { cakeId } })
  if (count >= SLOTS_PER_CAKE) {
    await prisma.birthdayCake.update({ where: { id: cakeId }, data: { isComplete: true } })
  }
}
