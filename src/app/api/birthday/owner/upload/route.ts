export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/birthday/db"
import { createClient } from "@supabase/supabase-js"

const OWNER_PASSWORD = process.env.BIRTHDAY_OWNER_PASSWORD ?? "jhanvi2025"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const password = formData.get("password") as string
  const polaroidId = formData.get("polaroidId") as string
  const caption = formData.get("caption") as string | null
  const file = formData.get("file") as File | null

  if (password !== OWNER_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!file || !polaroidId) {
    return NextResponse.json({ error: "Missing file or polaroidId" }, { status: 400 })
  }

  const supabase = getSupabase()
  const ext = file.name.split(".").pop()
  const path = `birthday/polaroids/${polaroidId}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from("birthday-photos")
    .upload(path, buffer, { upsert: true, contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from("birthday-photos").getPublicUrl(path)

  await prisma.birthdayPolaroid.update({
    where: { id: polaroidId },
    data: { imageUrl: publicUrl, caption: caption ?? undefined },
  })

  return NextResponse.json({ success: true, imageUrl: publicUrl })
}

// Create a new polaroid placeholder
export async function PUT(req: NextRequest) {
  const { password, posX, posY, rotation, cakeId, zIndex } = await req.json()

  if (password !== OWNER_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const polaroid = await prisma.birthdayPolaroid.create({
    data: { posX, posY, rotation: rotation ?? 0, cakeId: cakeId ?? null, zIndex: zIndex ?? 1 },
  })

  return NextResponse.json({ polaroid })
}

export async function PATCH(req: NextRequest) {
  const { password, polaroidId, posX, posY, rotation, caption } = await req.json()

  if (password !== OWNER_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const polaroid = await prisma.birthdayPolaroid.update({
    where: { id: polaroidId },
    data: {
      ...(posX !== undefined && { posX }),
      ...(posY !== undefined && { posY }),
      ...(rotation !== undefined && { rotation }),
      ...(caption !== undefined && { caption }),
    },
  })

  return NextResponse.json({ polaroid })
}
