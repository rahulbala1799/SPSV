import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { ChapterCard } from '@/components/dashboard/ChapterCard'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { manualChapters } from '@/data/manualContent'

export default async function DashboardPage() {
  const user = await requireAuth()

  // Get user progress
  const progress = await prisma.chapterProgress.findMany({
    where: { userId: user.id },
  })

  // Get question answers count
  const questionAnswers = await prisma.questionAnswer.findMany({
    where: { userId: user.id },
  })

  const progressMap = new Map(
    progress.map(p => [p.chapterId, p])
  )

  const stats = {
    totalChapters: manualChapters.length,
    completedChapters: progress.filter(p => p.isCompleted).length,
    totalQuestions: questionAnswers.length,
    correctAnswers: questionAnswers.filter(q => q.isCorrect).length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name || user.email}!
        </h1>
        <p className="text-gray-600">
          Continue your SPSV test preparation
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Chapters</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manualChapters.map((chapter) => {
            const chapterProgress = progressMap.get(chapter.id)
            return (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                progress={chapterProgress ? {
                  id: chapterProgress.id,
                  chapterId: chapterProgress.chapterId,
                  isCompleted: chapterProgress.isCompleted,
                  lastAccessed: chapterProgress.lastAccessed,
                  notes: chapterProgress.notes,
                } : undefined}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
