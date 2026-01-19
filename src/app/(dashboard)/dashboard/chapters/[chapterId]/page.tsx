import { requireAuth } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { manualChapters } from '@/data/manualContent'
import { manualQuestions } from '@/data/manualQuestions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaBook } from 'react-icons/fa'
import { ChapterSection } from '@/components/dashboard/ChapterSection'
import { ChapterQuestions } from '@/components/dashboard/ChapterQuestions'

export default async function ChapterDetailPage({
  params,
}: {
  params: { chapterId: string }
}) {
  const user = await requireAuth()
  
  // Find the chapter
  const chapter = manualChapters.find(c => c.id === params.chapterId)
  
  if (!chapter) {
    notFound()
  }

  // Get questions for this chapter
  const chapterQuestions = manualQuestions.find(q => q.chapterId === params.chapterId)

  // Get user's progress for this chapter
  const progress = await prisma.chapterProgress.findUnique({
    where: {
      userId_chapterId: {
        userId: user.id,
        chapterId: params.chapterId,
      }
    }
  })

  // Get user's question answers for this chapter
  const questionAnswers = await prisma.questionAnswer.findMany({
    where: {
      userId: user.id,
      chapterId: params.chapterId,
    }
  })

  // Create a map of answered questions
  const answeredQuestions = new Map(
    questionAnswers.map(qa => [qa.questionId, qa])
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4 transition-colors"
        >
          <FaArrowLeft />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <FaBook className="text-green-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{chapter.title}</h1>
            {chapter.pageRange && (
              <p className="text-gray-600">
                Pages {chapter.pageRange.start}-{chapter.pageRange.end}
              </p>
            )}
          </div>
        </div>

        {progress && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Progress</p>
                <p className="text-lg font-semibold text-gray-900">
                  {progress.isCompleted ? 'Completed' : 'In Progress'}
                </p>
              </div>
              {progress.isCompleted && (
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                  ✓ Completed
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chapter Content */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <ChapterSection
          chapter={chapter}
          progress={progress}
        />
      </div>

      {/* Chapter Questions */}
      {chapterQuestions && chapterQuestions.questions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Practice Questions
          </h2>
          <ChapterQuestions
            chapterId={params.chapterId}
            questions={chapterQuestions.questions}
            answeredQuestions={answeredQuestions}
          />
        </div>
      )}
    </div>
  )
}
