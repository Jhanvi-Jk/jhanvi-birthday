export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma, getOrCreateActiveCake, getActiveCakeSlotNum, getNextArrivalOrder, maybeCompleteCake } from "@/lib/birthday/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, choice, slotNum, cakeId, letter, memory, word } = body

    if (!name?.trim() || !choice?.trim()) {
      return NextResponse.json({ error: "Name and choice required" }, { status: 400 })
    }

    const cake = cakeId
      ? await prisma.birthdayCake.findUnique({ where: { id: cakeId } })
      : await getOrCreateActiveCake()

    if (!cake) return NextResponse.json({ error: "No active cake" }, { status: 404 })

    const arrivalOrder = await getNextArrivalOrder()
    const resolvedSlot = slotNum ?? (await getActiveCakeSlotNum(cake.id))

    const contributor = await prisma.birthdayContributor.create({
      data: {
        name: name.trim(),
        cakeId: cake.id,
        slotNum: resolvedSlot,
        choice: choice.trim(),
        arrivalOrder,
      },
    })

    // Update cake field for this slot
    const slotField: Record<number, string> = {
      1: "shape",
      2: "frostingColor",
      3: "decoration",
      4: "ribbon",
      5: "candles",
    }
    const field = slotField[resolvedSlot as number]
    if (field) {
      await prisma.birthdayCake.update({ where: { id: cake.id }, data: { [field]: choice.trim() } })
    }

    // Letter
    if (letter?.trim()) {
      await prisma.birthdayLetter.create({
        data: { contributorId: contributor.id, cakeId: cake.id, content: letter.trim() },
      })
    }

    // Memory jar
    if (memory?.trim()) {
      await prisma.birthdayMemory.create({
        data: { contributorId: contributor.id, content: memory.trim() },
      })
    }

    // Word cloud
    if (word?.trim()) {
      await prisma.birthdayWord.create({
        data: { contributorId: contributor.id, word: word.trim().toLowerCase() },
      })
    }

    await maybeCompleteCake(cake.id)

    return NextResponse.json({ success: true, contributorId: contributor.id, cakeId: cake.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET() {
  const cake = await getOrCreateActiveCake()
  const slotNum = await getActiveCakeSlotNum(cake.id)
  const updatedCake = await prisma.birthdayCake.findUnique({ where: { id: cake.id } })
  return NextResponse.json({ cake: updatedCake, nextSlot: slotNum })
}
