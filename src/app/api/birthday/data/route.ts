export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { getAllCakes, getMemories, getWords, getPolaroids } from "@/lib/birthday/db"

export async function GET() {
  const [cakes, memories, words, polaroids] = await Promise.all([
    getAllCakes(),
    getMemories(),
    getWords(),
    getPolaroids(),
  ])
  return NextResponse.json({ cakes, memories, words, polaroids })
}
