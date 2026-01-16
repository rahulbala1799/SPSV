#!/usr/bin/env python3
"""
Extract text content from PDF and organize by pages
"""
import sys
import json

HAS_PYPDF2 = False
HAS_PDFPLUMBER = False

try:
    import PyPDF2
    HAS_PYPDF2 = True
except ImportError:
    pass

if not HAS_PYPDF2:
    try:
        import pdfplumber
        HAS_PDFPLUMBER = True
    except ImportError:
        pass

def extract_with_pypdf2(pdf_path):
    """Extract using PyPDF2"""
    pages_content = []
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        total_pages = len(pdf_reader.pages)
        
        for page_num in range(total_pages):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            pages_content.append({
                'page': page_num + 1,
                'text': text
            })
    
    return pages_content

def extract_with_pdfplumber(pdf_path):
    """Extract using pdfplumber"""
    pages_content = []
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            text = page.extract_text()
            pages_content.append({
                'page': page_num + 1,
                'text': text or ''
            })
    
    return pages_content

if __name__ == '__main__':
    pdf_path = './images/nta.pdf'
    
    if HAS_PDFPLUMBER:
        print("Using pdfplumber...")
        pages = extract_with_pdfplumber(pdf_path)
    elif HAS_PYPDF2:
        print("Using PyPDF2...")
        pages = extract_with_pypdf2(pdf_path)
    else:
        print("ERROR: No PDF library found. Please install PyPDF2 or pdfplumber:")
        print("  pip3 install PyPDF2")
        print("  or")
        print("  pip3 install pdfplumber")
        sys.exit(1)
    
    # Save to JSON
    output = {
        'total_pages': len(pages),
        'pages': pages
    }
    
    with open('pdf-content.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"Extracted {len(pages)} pages")
    print(f"Saved to pdf-content.json")
