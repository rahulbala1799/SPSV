// Motivational quotes for SPSV Taxi Course students
// These quotes are designed to encourage students preparing for their taxi exam

export interface MotivationalQuote {
  quote: string
  author: string
  category: 'persistence' | 'success' | 'learning' | 'confidence' | 'action'
}

export const motivationalQuotes: MotivationalQuote[] = [
  // Persistence quotes
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "persistence" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "persistence" },
  { quote: "Every expert was once a beginner.", author: "Helen Hayes", category: "persistence" },
  { quote: "The road to success is always under construction.", author: "Lily Tomlin", category: "persistence" },
  { quote: "Small daily improvements are the key to staggering long-term results.", author: "Unknown", category: "persistence" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "persistence" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "persistence" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "persistence" },
  
  // Success quotes
  { quote: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "success" },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "success" },
  { quote: "Your SPSV licence is within reach. Keep pushing!", author: "Stij Learning", category: "success" },
  { quote: "Winners are not people who never fail, but people who never quit.", author: "Edwin Louis Cole", category: "success" },
  { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "success" },
  { quote: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson", category: "success" },
  { quote: "Dream big, work hard, stay focused, and surround yourself with good people.", author: "Unknown", category: "success" },
  { quote: "Your future starts with what you do today.", author: "Unknown", category: "success" },
  
  // Learning quotes
  { quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss", category: "learning" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela", category: "learning" },
  { quote: "Learning is not attained by chance; it must be sought for with ardor and diligence.", author: "Abigail Adams", category: "learning" },
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King", category: "learning" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", category: "learning" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", category: "learning" },
  { quote: "Knowledge is knowing Dublin streets. Wisdom is getting passengers there on time.", author: "Stij Learning", category: "learning" },
  { quote: "Every question you practice brings you one step closer to passing.", author: "Stij Learning", category: "learning" },
  
  // Confidence quotes
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "confidence" },
  { quote: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne", category: "confidence" },
  { quote: "Confidence comes not from always being right but from not fearing to be wrong.", author: "Peter T. McIntyre", category: "confidence" },
  { quote: "With confidence, you have won before you have started.", author: "Marcus Garvey", category: "confidence" },
  { quote: "You've studied the routes, you know the answers. Trust yourself!", author: "Stij Learning", category: "confidence" },
  { quote: "Self-belief and hard work will always earn you success.", author: "Virat Kohli", category: "confidence" },
  { quote: "The only person who can pull you down is yourself, and you're not going to let that happen.", author: "Unknown", category: "confidence" },
  { quote: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem", category: "confidence" },
  
  // Action quotes
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "action" },
  { quote: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu", category: "action" },
  { quote: "Well done is better than well said.", author: "Benjamin Franklin", category: "action" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", category: "action" },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "action" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso", category: "action" },
  { quote: "Every chapter completed is a chapter closer to your licence.", author: "Stij Learning", category: "action" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", category: "action" },
  
  // Exam-specific motivational quotes
  { quote: "The SPSV exam tests your knowledge, not your worth. You've got this!", author: "Stij Learning", category: "confidence" },
  { quote: "Every Dublin street you memorize is a step toward your new career.", author: "Stij Learning", category: "learning" },
  { quote: "Taxi drivers are the heartbeat of Dublin transport. Soon, you'll join them!", author: "Stij Learning", category: "success" },
  { quote: "Practice doesn't make perfect. Practice makes progress.", author: "Unknown", category: "persistence" },
  { quote: "The exam is just one day. Your preparation defines your success.", author: "Stij Learning", category: "action" },
  { quote: "From O'Connell Street to Phoenix Park, you're learning to navigate success.", author: "Stij Learning", category: "learning" },
]

// Get a random quote
export function getRandomQuote(): MotivationalQuote {
  const index = Math.floor(Math.random() * motivationalQuotes.length)
  return motivationalQuotes[index]
}

// Get a quote by category
export function getQuoteByCategory(category: MotivationalQuote['category']): MotivationalQuote {
  const categoryQuotes = motivationalQuotes.filter(q => q.category === category)
  const index = Math.floor(Math.random() * categoryQuotes.length)
  return categoryQuotes[index]
}

// Get quote of the day (consistent for the day)
export function getQuoteOfTheDay(): MotivationalQuote {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
  const index = dayOfYear % motivationalQuotes.length
  return motivationalQuotes[index]
}
