const fs = require('fs');
const pdf = require('pdf-parse');

async function extractPDFContent() {
  try {
    const dataBuffer = fs.readFileSync('./images/nta.pdf');
    const data = await pdf(dataBuffer);
    
    // Split by pages
    const pages = [];
    const text = data.text;
    
    // Try to identify page breaks (this is approximate)
    // PDF-parse doesn't always give exact page breaks, so we'll work with the full text
    // and try to identify sections
    
    return {
      totalPages: data.numpages,
      text: text,
      info: data.info,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error extracting PDF:', error);
    throw error;
  }
}

extractPDFContent()
  .then(result => {
    // Write to JSON file for processing
    fs.writeFileSync('./pdf-content.json', JSON.stringify(result, null, 2));
    console.log(`Extracted ${result.totalPages} pages`);
    console.log(`Text length: ${result.text.length} characters`);
  })
  .catch(error => {
    console.error('Failed to extract PDF:', error);
  });
