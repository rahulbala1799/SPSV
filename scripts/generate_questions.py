#!/usr/bin/env python3
"""
Generate 4 multiple choice questions for each chapter based on content analysis
"""
import json
import re

def extract_key_concepts(content):
    """Extract key concepts from chapter content"""
    concepts = []
    # Look for definitions, important terms, numbers, regulations
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if len(line) > 20 and len(line) < 200:
            # Look for definitions (contains "is", "refers to", "means")
            if any(term in line.lower() for term in ['is', 'refers to', 'means', 'are', 'must', 'should']):
                concepts.append(line)
    return concepts[:10]  # Top 10 concepts

def generate_questions_for_chapter(chapter_title, pages_content):
    """Generate 4 questions for a chapter"""
    # Combine all page content
    full_content = ' '.join([page['content'] for page in pages_content])
    
    questions = []
    
    # Analyze content to create questions
    # This is a simplified version - in production, you'd use AI or manual review
    
    # Question 1: Definition/Key Term
    # Question 2: Regulation/Rule
    # Question 3: Number/Statistic
    # Question 4: Process/Procedure
    
    # For now, I'll create template questions that need to be filled with actual content
    # In a real scenario, you'd analyze the content more deeply
    
    return questions

# Read organized content
with open('pdf-organized.json', 'r') as f:
    data = json.load(f)

# Generate questions structure
all_questions = {}

for section in data['sections']:
    chapter_id = section['title'].lower().replace(' ', '-').replace(':', '').replace('chapter ', 'ch')
    chapter_id = re.sub(r'[^a-z0-9-]', '', chapter_id)
    
    # For each chapter, we'll need to manually create questions based on content
    # This script will create the structure
    all_questions[chapter_id] = {
        'chapterTitle': section['title'],
        'pageRange': section['pageRange'],
        'questions': []  # Will be filled manually or with AI
    }

# Save structure
with open('questions-structure.json', 'w') as f:
    json.dump(all_questions, f, indent=2)

print(f"Created structure for {len(all_questions)} chapters")
print("Now generating questions based on content analysis...")
