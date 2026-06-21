import { getWords, getMemories, getPolaroids, getAllCakes } from "@/lib/birthday/db"
import July3Client from "./July3Client"

export const dynamic = "force-dynamic"

export default async function July3Page() {
  const [words, memories, polaroids, cakes] = await Promise.all([
    getWords(),
    getMemories(),
    getPolaroids(),
    getAllCakes(),
  ])

  return (
    <July3Client
      words={words as never}
      memories={memories as never}
      polaroids={polaroids as never}
      cakes={cakes as never}
    />
  )
}
