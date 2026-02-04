/**
 * Seeded shuffle utilities for quiz/chapter option order.
 * Same seed + same options => same order (stable across remount/refresh).
 * See CHAPTERS_AND_TESTS_STRUCTURE_README.md §5.
 */

/** Seeded PRNG (mulberry32). Same seed => same sequence of "random" numbers. */
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t ^ (t >>> 12))
    return (t >>> 0) / 4294967296
  }
}

/** Hash a string to a number (for seed). */
function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i)
  }
  return h >>> 0
}

/**
 * Deterministic Fisher–Yates shuffle. Same (array, seed) => same order every time.
 */
export function shuffleArrayWithSeed<T>(array: T[], seed: string): T[] {
  const rng = mulberry32(hashString(seed))
  const out = [...array]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Shuffle options that have an id (chapters, untimed, assigned). */
export function shuffleOptionsWithSeed<T extends { id: string }>(
  options: T[],
  seed: string
): T[] {
  return shuffleArrayWithSeed(options, seed)
}

/**
 * Shuffle options array for chapters/untimed/assigned. Seed = e.g. attemptId + question.id or chapterSessionId + question.id.
 */
export function getShuffledOptions(
  options: { id: string; text: string }[],
  seed: string
): { id: string; text: string }[] {
  return shuffleOptionsWithSeed(options, seed)
}

export interface TimedOptionEntry {
  letter: string
  text: string
}

/**
 * For timed tests: options are { A, B, C, D }. Returns shuffled array of { letter, text }.
 * Submit/store still by letter; display order is shuffled. Use positional label (1st, 2nd, …) in UI.
 */
export function shuffleTimedOptionsWithSeed(
  options: { A: string; B: string; C: string; D: string },
  seed: string
): TimedOptionEntry[] {
  const entries: TimedOptionEntry[] = (['A', 'B', 'C', 'D'] as const).map(
    (letter) => ({ letter, text: options[letter] })
  )
  return shuffleArrayWithSeed(entries, seed)
}

/** Get or create a chapter session id (stable for this visit to the chapter). */
const CHAPTER_SESSION_KEY_PREFIX = 'chapter-shuffle-session-'

export function getOrCreateChapterSessionId(chapterId: string): string {
  if (typeof window === 'undefined') return chapterId
  const key = CHAPTER_SESSION_KEY_PREFIX + chapterId
  let sessionId = sessionStorage.getItem(key)
  if (!sessionId) {
    sessionId = crypto.randomUUID?.() ?? `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem(key, sessionId)
  }
  return sessionId
}
