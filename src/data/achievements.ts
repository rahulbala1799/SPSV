// Achievement definitions for the motivation system
// These define what achievements exist and their unlock requirements

export interface AchievementDefinition {
  code: string
  name: string
  description: string
  type: 'MEDAL' | 'TROPHY' | 'BADGE'
  tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  icon: string
  pointsValue: number
  category: string
  requirement: {
    type: string
    count: number
    extra?: Record<string, unknown>
  }
  sortOrder: number
}

// Clever algorithm: Early achievements are easier, rewards diminish as progress increases
// Formula for points: basePoints * (1 / (1 + log(tier)))
// This means first achievements give more, later ones give proportionally less

export const achievementDefinitions: AchievementDefinition[] = [
  // ===== QUESTIONS ANSWERED MEDALS =====
  // Early rewards are generous to hook users
  {
    code: 'FIRST_QUESTION',
    name: 'First Steps',
    description: 'Answer your first question',
    type: 'BADGE',
    icon: '🎯',
    pointsValue: 50, // High initial reward
    category: 'questions',
    requirement: { type: 'questions_answered', count: 1 },
    sortOrder: 1
  },
  {
    code: 'QUESTIONS_10',
    name: 'Getting Started',
    description: 'Answer 10 questions',
    type: 'MEDAL',
    tier: 'BRONZE',
    icon: '📝',
    pointsValue: 100,
    category: 'questions',
    requirement: { type: 'questions_answered', count: 10 },
    sortOrder: 2
  },
  {
    code: 'QUESTIONS_25',
    name: 'Quick Learner',
    description: 'Answer 25 questions',
    type: 'MEDAL',
    tier: 'BRONZE',
    icon: '✏️',
    pointsValue: 75, // Diminishing return
    category: 'questions',
    requirement: { type: 'questions_answered', count: 25 },
    sortOrder: 3
  },
  {
    code: 'QUESTIONS_50',
    name: 'Dedicated Student',
    description: 'Answer 50 questions',
    type: 'MEDAL',
    tier: 'SILVER',
    icon: '📚',
    pointsValue: 150,
    category: 'questions',
    requirement: { type: 'questions_answered', count: 50 },
    sortOrder: 4
  },
  {
    code: 'QUESTIONS_100',
    name: 'Century Club',
    description: 'Answer 100 questions',
    type: 'MEDAL',
    tier: 'SILVER',
    icon: '💯',
    pointsValue: 200,
    category: 'questions',
    requirement: { type: 'questions_answered', count: 100 },
    sortOrder: 5
  },
  {
    code: 'QUESTIONS_250',
    name: 'Knowledge Seeker',
    description: 'Answer 250 questions',
    type: 'MEDAL',
    tier: 'GOLD',
    icon: '🔍',
    pointsValue: 300,
    category: 'questions',
    requirement: { type: 'questions_answered', count: 250 },
    sortOrder: 6
  },
  {
    code: 'QUESTIONS_500',
    name: 'Question Master',
    description: 'Answer 500 questions',
    type: 'TROPHY',
    icon: '🏆',
    pointsValue: 500,
    category: 'questions',
    requirement: { type: 'questions_answered', count: 500 },
    sortOrder: 7
  },
  {
    code: 'QUESTIONS_1000',
    name: 'Legendary Learner',
    description: 'Answer 1000 questions',
    type: 'TROPHY',
    icon: '👑',
    pointsValue: 1000,
    category: 'questions',
    requirement: { type: 'questions_answered', count: 1000 },
    sortOrder: 8
  },

  // ===== CORRECT ANSWERS MEDALS =====
  {
    code: 'CORRECT_5',
    name: 'Sharp Mind',
    description: 'Get 5 correct answers',
    type: 'BADGE',
    icon: '✅',
    pointsValue: 30,
    category: 'accuracy',
    requirement: { type: 'correct_answers', count: 5 },
    sortOrder: 10
  },
  {
    code: 'CORRECT_25',
    name: 'Accurate',
    description: 'Get 25 correct answers',
    type: 'MEDAL',
    tier: 'BRONZE',
    icon: '🎯',
    pointsValue: 100,
    category: 'accuracy',
    requirement: { type: 'correct_answers', count: 25 },
    sortOrder: 11
  },
  {
    code: 'CORRECT_100',
    name: 'Precision Expert',
    description: 'Get 100 correct answers',
    type: 'MEDAL',
    tier: 'SILVER',
    icon: '💎',
    pointsValue: 200,
    category: 'accuracy',
    requirement: { type: 'correct_answers', count: 100 },
    sortOrder: 12
  },
  {
    code: 'CORRECT_500',
    name: 'Knowledge Champion',
    description: 'Get 500 correct answers',
    type: 'MEDAL',
    tier: 'GOLD',
    icon: '🌟',
    pointsValue: 400,
    category: 'accuracy',
    requirement: { type: 'correct_answers', count: 500 },
    sortOrder: 13
  },

  // ===== CHAPTER COMPLETION MEDALS =====
  {
    code: 'CHAPTER_FIRST',
    name: 'Chapter One',
    description: 'Complete your first chapter',
    type: 'BADGE',
    icon: '📖',
    pointsValue: 100, // High reward for first completion
    category: 'chapters',
    requirement: { type: 'chapters_completed', count: 1 },
    sortOrder: 20
  },
  {
    code: 'CHAPTERS_3',
    name: 'Triple Threat',
    description: 'Complete 3 chapters',
    type: 'MEDAL',
    tier: 'BRONZE',
    icon: '📗',
    pointsValue: 150,
    category: 'chapters',
    requirement: { type: 'chapters_completed', count: 3 },
    sortOrder: 21
  },
  {
    code: 'CHAPTERS_5',
    name: 'Halfway Hero',
    description: 'Complete 5 chapters',
    type: 'MEDAL',
    tier: 'SILVER',
    icon: '📘',
    pointsValue: 200,
    category: 'chapters',
    requirement: { type: 'chapters_completed', count: 5 },
    sortOrder: 22
  },
  {
    code: 'CHAPTERS_10',
    name: 'Chapter Champion',
    description: 'Complete 10 chapters',
    type: 'MEDAL',
    tier: 'GOLD',
    icon: '📙',
    pointsValue: 350,
    category: 'chapters',
    requirement: { type: 'chapters_completed', count: 10 },
    sortOrder: 23
  },
  {
    code: 'CHAPTERS_ALL',
    name: 'Course Conqueror',
    description: 'Complete all chapters',
    type: 'TROPHY',
    icon: '🎓',
    pointsValue: 1000,
    category: 'chapters',
    requirement: { type: 'chapters_completed', count: 18 }, // Adjust based on total chapters
    sortOrder: 24
  },

  // ===== TEST COMPLETION MEDALS =====
  {
    code: 'TEST_FIRST',
    name: 'Test Taker',
    description: 'Complete your first test',
    type: 'BADGE',
    icon: '📋',
    pointsValue: 75,
    category: 'tests',
    requirement: { type: 'tests_completed', count: 1 },
    sortOrder: 30
  },
  {
    code: 'TESTS_5',
    name: 'Test Veteran',
    description: 'Complete 5 tests',
    type: 'MEDAL',
    tier: 'BRONZE',
    icon: '📝',
    pointsValue: 150,
    category: 'tests',
    requirement: { type: 'tests_completed', count: 5 },
    sortOrder: 31
  },
  {
    code: 'TESTS_10',
    name: 'Test Expert',
    description: 'Complete 10 tests',
    type: 'MEDAL',
    tier: 'SILVER',
    icon: '🧪',
    pointsValue: 250,
    category: 'tests',
    requirement: { type: 'tests_completed', count: 10 },
    sortOrder: 32
  },
  {
    code: 'TESTS_25',
    name: 'Test Master',
    description: 'Complete 25 tests',
    type: 'MEDAL',
    tier: 'GOLD',
    icon: '🏅',
    pointsValue: 400,
    category: 'tests',
    requirement: { type: 'tests_completed', count: 25 },
    sortOrder: 33
  },

  // ===== PERFECT SCORE ACHIEVEMENTS =====
  {
    code: 'PERFECT_FIRST',
    name: 'Perfect Start',
    description: 'Get a perfect score on any test',
    type: 'BADGE',
    icon: '⭐',
    pointsValue: 200,
    category: 'perfection',
    requirement: { type: 'perfect_scores', count: 1 },
    sortOrder: 40
  },
  {
    code: 'PERFECT_5',
    name: 'Perfectionist',
    description: 'Get 5 perfect scores',
    type: 'MEDAL',
    tier: 'GOLD',
    icon: '🌟',
    pointsValue: 500,
    category: 'perfection',
    requirement: { type: 'perfect_scores', count: 5 },
    sortOrder: 41
  },
  {
    code: 'PERFECT_10',
    name: 'Flawless',
    description: 'Get 10 perfect scores',
    type: 'TROPHY',
    icon: '💫',
    pointsValue: 1000,
    category: 'perfection',
    requirement: { type: 'perfect_scores', count: 10 },
    sortOrder: 42
  },

  // ===== STREAK ACHIEVEMENTS =====
  {
    code: 'STREAK_3',
    name: 'On Fire',
    description: '3 day learning streak',
    type: 'BADGE',
    icon: '🔥',
    pointsValue: 50,
    category: 'streaks',
    requirement: { type: 'daily_streak', count: 3 },
    sortOrder: 50
  },
  {
    code: 'STREAK_7',
    name: 'Week Warrior',
    description: '7 day learning streak',
    type: 'MEDAL',
    tier: 'BRONZE',
    icon: '🔥',
    pointsValue: 150,
    category: 'streaks',
    requirement: { type: 'daily_streak', count: 7 },
    sortOrder: 51
  },
  {
    code: 'STREAK_14',
    name: 'Fortnight Fighter',
    description: '14 day learning streak',
    type: 'MEDAL',
    tier: 'SILVER',
    icon: '🔥',
    pointsValue: 300,
    category: 'streaks',
    requirement: { type: 'daily_streak', count: 14 },
    sortOrder: 52
  },
  {
    code: 'STREAK_30',
    name: 'Monthly Master',
    description: '30 day learning streak',
    type: 'MEDAL',
    tier: 'GOLD',
    icon: '🔥',
    pointsValue: 500,
    category: 'streaks',
    requirement: { type: 'daily_streak', count: 30 },
    sortOrder: 53
  },
  {
    code: 'STREAK_60',
    name: 'Unstoppable',
    description: '60 day learning streak',
    type: 'TROPHY',
    icon: '⚡',
    pointsValue: 1000,
    category: 'streaks',
    requirement: { type: 'daily_streak', count: 60 },
    sortOrder: 54
  },

  // ===== SPECIAL TROPHIES =====
  {
    code: 'INDUSTRY_EXPERT',
    name: 'Industry Expert',
    description: 'Complete all Industry Knowledge chapters',
    type: 'TROPHY',
    icon: '🚕',
    pointsValue: 500,
    category: 'special',
    requirement: { type: 'category_complete', count: 1, extra: { category: 'INDUSTRY_KNOWLEDGE' } },
    sortOrder: 60
  },
  {
    code: 'AREA_EXPERT',
    name: 'Dublin Navigator',
    description: 'Complete all Area Knowledge chapters',
    type: 'TROPHY',
    icon: '🗺️',
    pointsValue: 500,
    category: 'special',
    requirement: { type: 'category_complete', count: 1, extra: { category: 'AREA_KNOWLEDGE' } },
    sortOrder: 61
  },
  {
    code: 'SPEED_DEMON',
    name: 'Speed Demon',
    description: 'Complete a timed test with 90%+ score',
    type: 'TROPHY',
    icon: '⚡',
    pointsValue: 300,
    category: 'special',
    requirement: { type: 'timed_test_score', count: 90 },
    sortOrder: 62
  },
  {
    code: 'EXAM_READY',
    name: 'Exam Ready',
    description: 'Achieve 80%+ overall course progress',
    type: 'TROPHY',
    icon: '🎯',
    pointsValue: 750,
    category: 'special',
    requirement: { type: 'overall_progress', count: 80 },
    sortOrder: 63
  },
  {
    code: 'ULTIMATE_CHAMPION',
    name: 'Ultimate Champion',
    description: 'Complete the entire course with 90%+ average score',
    type: 'TROPHY',
    icon: '👑',
    pointsValue: 2000,
    category: 'special',
    requirement: { type: 'course_complete', count: 90 },
    sortOrder: 99
  },
]

// Calculate level from total points
// Uses a logarithmic scale so early levels are easier
export function calculateLevel(totalPoints: number): { level: number; currentXP: number; nextLevelXP: number; progress: number } {
  // Level formula: level = floor(sqrt(points / 100))
  // This means:
  // Level 1: 0-99 points
  // Level 2: 100-399 points
  // Level 3: 400-899 points
  // etc.
  
  const level = Math.max(1, Math.floor(Math.sqrt(totalPoints / 100)) + 1)
  const pointsForCurrentLevel = Math.pow(level - 1, 2) * 100
  const pointsForNextLevel = Math.pow(level, 2) * 100
  const currentXP = totalPoints - pointsForCurrentLevel
  const nextLevelXP = pointsForNextLevel - pointsForCurrentLevel
  const progress = Math.min(100, Math.round((currentXP / nextLevelXP) * 100))
  
  return { level, currentXP, nextLevelXP, progress }
}

// Get level title based on level number
export function getLevelTitle(level: number): string {
  if (level <= 2) return 'Beginner'
  if (level <= 4) return 'Apprentice'
  if (level <= 7) return 'Learner'
  if (level <= 10) return 'Student'
  if (level <= 15) return 'Scholar'
  if (level <= 20) return 'Expert'
  if (level <= 25) return 'Master'
  if (level <= 30) return 'Champion'
  return 'Legend'
}

// Points awarded for different actions (diminishing returns built-in)
export function calculateActionPoints(action: string, count: number): number {
  const basePoints: Record<string, number> = {
    'question_correct': 5,
    'question_incorrect': 1, // Still reward for trying
    'chapter_started': 10,
    'chapter_completed': 50,
    'test_completed': 25,
    'test_passed': 50,
    'perfect_score': 100,
    'daily_login': 10,
  }

  const base = basePoints[action] || 0
  
  // Diminishing returns: Each subsequent action gives slightly less
  // Formula: base * (1 / (1 + 0.01 * log(count + 1)))
  const diminishingFactor = 1 / (1 + 0.01 * Math.log(count + 1))
  
  return Math.max(1, Math.round(base * diminishingFactor))
}

// Get achievements by category
export function getAchievementsByCategory(category: string): AchievementDefinition[] {
  return achievementDefinitions.filter(a => a.category === category).sort((a, b) => a.sortOrder - b.sortOrder)
}

// Get all trophies
export function getAllTrophies(): AchievementDefinition[] {
  return achievementDefinitions.filter(a => a.type === 'TROPHY').sort((a, b) => a.sortOrder - b.sortOrder)
}

// Get all medals
export function getAllMedals(): AchievementDefinition[] {
  return achievementDefinitions.filter(a => a.type === 'MEDAL').sort((a, b) => a.sortOrder - b.sortOrder)
}

// Get all badges
export function getAllBadges(): AchievementDefinition[] {
  return achievementDefinitions.filter(a => a.type === 'BADGE').sort((a, b) => a.sortOrder - b.sortOrder)
}
