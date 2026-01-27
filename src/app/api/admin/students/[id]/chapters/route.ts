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
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') || 'chapterNumber' // chapterNumber, progress, timeSpent, accuracy

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

    // Get all active chapters
    const allChapters = await prisma.chapter.findMany({
      where: { isActive: true },
      orderBy: { chapterNumber: 'asc' }
    })

    // Get student's progress for these chapters
    const progressRecords = await prisma.chapterProgress.findMany({
      where: { 
        studentId,
        chapterId: { in: allChapters.map(c => c.id) }
      }
    })

    // Create a map for quick lookup
    const progressMap = new Map(
      progressRecords.map(p => [p.chapterId, p])
    )

    // Combine chapter info with progress
    const chaptersWithProgress = allChapters.map(chapter => {
      const progress = progressMap.get(chapter.id)
      
      return {
        id: chapter.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        type: chapter.type,
        category: chapter.category,
        duration: chapter.duration,
        status: progress?.isCompleted 
          ? 'COMPLETED' 
          : progress?.startedAt 
            ? 'IN_PROGRESS' 
            : 'NOT_STARTED',
        progressPercent: progress?.progressPercent || 0,
        timeSpentSeconds: progress?.timeSpentSeconds || 0,
        totalQuestions: progress?.totalQuestions || 0,
        correctAnswers: progress?.correctAnswers || 0,
        accuracy: progress && progress.totalQuestions > 0
          ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
          : 0,
        startedAt: progress?.startedAt?.toISOString() || null,
        completedAt: progress?.completedAt?.toISOString() || null,
        lastAccessed: progress?.lastAccessed?.toISOString() || null
      }
    })

    // Sort based on query parameter
    let sortedChapters = [...chaptersWithProgress]
    switch (sortBy) {
      case 'progress':
        sortedChapters.sort((a, b) => b.progressPercent - a.progressPercent)
        break
      case 'timeSpent':
        sortedChapters.sort((a, b) => b.timeSpentSeconds - a.timeSpentSeconds)
        break
      case 'accuracy':
        sortedChapters.sort((a, b) => b.accuracy - a.accuracy)
        break
      case 'chapterNumber':
      default:
        // Already sorted by chapter number
        break
    }

    // Calculate summary statistics
    const summary = {
      total: chaptersWithProgress.length,
      completed: chaptersWithProgress.filter(c => c.status === 'COMPLETED').length,
      inProgress: chaptersWithProgress.filter(c => c.status === 'IN_PROGRESS').length,
      notStarted: chaptersWithProgress.filter(c => c.status === 'NOT_STARTED').length,
      totalTimeSpent: chaptersWithProgress.reduce((sum, c) => sum + c.timeSpentSeconds, 0),
      averageAccuracy: chaptersWithProgress.length > 0
        ? Math.round(chaptersWithProgress.reduce((sum, c) => sum + c.accuracy, 0) / chaptersWithProgress.length)
        : 0
    }

    return NextResponse.json({ 
      chapters: sortedChapters,
      summary
    })
  } catch (error: any) {
    console.error('Error fetching chapter progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapter progress' },
      { status: 500 }
    )
  }
}
