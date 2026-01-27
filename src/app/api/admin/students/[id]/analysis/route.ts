import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const studentId = params.id

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Get chapter progress with accuracy data
    const chapterProgress = await prisma.chapterProgress.findMany({
      where: { studentId },
      include: {
        chapter: true
      }
    })

    // Calculate accuracy by chapter
    const chapterAnalysis = chapterProgress
      .filter(cp => cp.totalQuestions > 0)
      .map(cp => ({
        chapterId: cp.chapterId,
        chapterNumber: cp.chapter.chapterNumber,
        chapterTitle: cp.chapter.title,
        category: cp.chapter.category,
        totalQuestions: cp.totalQuestions,
        correctAnswers: cp.correctAnswers,
        accuracy: Math.round((cp.correctAnswers / cp.totalQuestions) * 100),
        timeSpent: cp.timeSpentSeconds
      }))

    // Strong areas (80%+ accuracy)
    const strongAreas = chapterAnalysis
      .filter(ch => ch.accuracy >= 80)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5)
      .map(ch => ({
        ...ch,
        performanceLevel: 'excellent'
      }))

    // Weak areas (<60% accuracy)
    const weakAreas = chapterAnalysis
      .filter(ch => ch.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5)
      .map(ch => ({
        ...ch,
        performanceLevel: 'needs improvement',
        recommendation: 'Review this chapter'
      }))

    // Category analysis (if applicable)
    const categoryMap = new Map<string, { correct: number; total: number }>()
    
    chapterAnalysis.forEach(ch => {
      if (ch.category) {
        const cat = ch.category
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, { correct: 0, total: 0 })
        }
        const data = categoryMap.get(cat)!
        data.correct += ch.correctAnswers
        data.total += ch.totalQuestions
      }
    })

    const categoryPerformance = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      accuracy: Math.round((data.correct / data.total) * 100),
      questionsAttempted: data.total,
      correctAnswers: data.correct
    })).sort((a, b) => b.accuracy - a.accuracy)

    // Overall topic distribution
    const topicDistribution = chapterAnalysis.map(ch => ({
      chapter: ch.chapterTitle,
      accuracy: ch.accuracy
    }))

    // Generate recommendations
    const recommendations = []
    if (weakAreas.length > 0) {
      recommendations.push({
        type: 'review',
        priority: 'high',
        message: `Focus on reviewing ${weakAreas.length} chapter(s) with low accuracy`,
        chapters: weakAreas.map(w => w.chapterTitle)
      })
    }
    
    const mediumAreas = chapterAnalysis.filter(ch => ch.accuracy >= 60 && ch.accuracy < 80)
    if (mediumAreas.length > 0) {
      recommendations.push({
        type: 'practice',
        priority: 'medium',
        message: `Practice ${mediumAreas.length} chapter(s) to improve from good to excellent`,
        chapters: mediumAreas.slice(0, 3).map(m => m.chapterTitle)
      })
    }

    if (strongAreas.length === chapterAnalysis.length && chapterAnalysis.length > 0) {
      recommendations.push({
        type: 'excellence',
        priority: 'info',
        message: 'Excellent performance across all chapters! Ready for final tests.',
        chapters: []
      })
    }

    return NextResponse.json({
      strongAreas,
      weakAreas,
      categoryPerformance,
      topicDistribution,
      recommendations,
      summary: {
        totalChaptersAnalyzed: chapterAnalysis.length,
        strongCount: strongAreas.length,
        weakCount: weakAreas.length,
        averageAccuracy: chapterAnalysis.length > 0
          ? Math.round(chapterAnalysis.reduce((sum, ch) => sum + ch.accuracy, 0) / chapterAnalysis.length)
          : 0
      }
    })
  } catch (error: any) {
    console.error('Error fetching strength/weakness analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis data' },
      { status: 500 }
    )
  }
}
