import { getAllCakes, getMemories, getWords, getPolaroids } from "@/lib/birthday/db"
import ScrapbookDesk from "@/components/birthday/ScrapbookDesk"

export const dynamic = "force-dynamic"

export default async function BirthdayPage() {
  const [cakes, memories, words, polaroids] = await Promise.all([
    getAllCakes(),
    getMemories(),
    getWords(),
    getPolaroids(),
  ])

  return (
    <ScrapbookDesk
      cakes={cakes as never}
      memories={memories as never}
      words={words as never}
      polaroids={polaroids as never}
    />
  )
}
