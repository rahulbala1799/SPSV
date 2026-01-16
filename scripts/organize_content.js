const fs = require('fs');

// Read the extracted PDF content
const pdfData = JSON.parse(fs.readFileSync('./pdf-content.json', 'utf-8'));

// Organize by chapters based on the table of contents
const sections = [
  { title: "Welcome", startPage: 7, endPage: 7 },
  { title: "Terminology", startPage: 8, endPage: 12 },
  { title: "Chapter 1: The SPSV industry", startPage: 13, endPage: 25 },
  { title: "Chapter 2: SPSV driver licensing", startPage: 27, endPage: 42 },
  { title: "Chapter 3: Choosing a vehicle to use as an SPSV", startPage: 44, endPage: 54 },
  { title: "Chapter 4: Vehicle licensing", startPage: 55, endPage: 79 },
  { title: "Chapter 5: Working as an SPSV operator", startPage: 80, endPage: 102 },
  { title: "Chapter 6: Finding your way around", startPage: 104, endPage: 115 },
  { title: "Chapter 7: Fares", startPage: 117, endPage: 126 },
  { title: "Chapter 8: Delivering customer satisfaction", startPage: 127, endPage: 152 },
  { title: "Chapter 9: Your SPSV business", startPage: 153, endPage: 173 },
  { title: "Chapter 10: Staying safe", startPage: 174, endPage: 195 },
  { title: "Chapter 11: Preparing for your test", startPage: 197, endPage: 207 },
  { title: "Appendices", startPage: 209, endPage: 221 }
];

// Create organized content structure
const organizedContent = {
  totalPages: pdfData.total_pages,
  sections: sections.map(section => {
    const sectionPages = pdfData.pages.filter(p => 
      p.page >= section.startPage && p.page <= section.endPage
    );
    
    // Get first few lines as summary
    const firstPageText = sectionPages[0]?.text || '';
    const summary = firstPageText.split('\n').filter(line => line.trim()).slice(0, 5).join(' ').substring(0, 200);
    
    return {
      title: section.title,
      pageRange: { start: section.startPage, end: section.endPage },
      totalPages: sectionPages.length,
      summary: summary + '...',
      pages: sectionPages.map(p => ({
        pageNumber: p.page,
        content: p.text.trim()
      }))
    };
  })
};

// Save organized content
fs.writeFileSync('./pdf-organized.json', JSON.stringify(organizedContent, null, 2));
console.log(`Organized ${organizedContent.sections.length} sections`);
console.log(`Total pages: ${organizedContent.totalPages}`);
