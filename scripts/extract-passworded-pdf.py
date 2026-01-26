#!/usr/bin/env python3
"""
Extract text content from password-protected PDF
"""
import sys
import json
import os

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

def extract_with_pypdf2(pdf_path, password):
    """Extract using PyPDF2 with password"""
    pages_content = []
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        # Decrypt if password-protected
        if pdf_reader.is_encrypted:
            if not pdf_reader.decrypt(password):
                raise ValueError("Failed to decrypt PDF. Incorrect password.")
        
        total_pages = len(pdf_reader.pages)
        
        for page_num in range(total_pages):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            pages_content.append({
                'page': page_num + 1,
                'text': text or ''
            })
    
    return pages_content

def extract_with_pdfplumber(pdf_path, password):
    """Extract using pdfplumber with password"""
    pages_content = []
    with pdfplumber.open(pdf_path, password=password) as pdf:
        for page_num, page in enumerate(pdf.pages):
            text = page.extract_text()
            pages_content.append({
                'page': page_num + 1,
                'text': text or ''
            })
    
    return pages_content

if __name__ == '__main__':
    pdf_path = './images/SOUTHSIDE QUAY QUESTIONS_SetPassword.pdf'
    password = 'SSJAN2026'
    
    if not os.path.exists(pdf_path):
        print(f"ERROR: PDF file not found at {pdf_path}")
        sys.exit(1)
    
    try:
        if HAS_PDFPLUMBER:
            print("Using pdfplumber...")
            pages = extract_with_pdfplumber(pdf_path, password)
        elif HAS_PYPDF2:
            print("Using PyPDF2...")
            pages = extract_with_pypdf2(pdf_path, password)
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
        
        output_file = 'southside-quay-questions.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Extracted {len(pages)} pages")
        print(f"✅ Saved to {output_file}")
        
        # Also print a preview of the first page
        if pages and pages[0]['text']:
            print("\n📄 Preview of first page:")
            print("-" * 80)
            preview = pages[0]['text'][:500]
            print(preview)
            if len(pages[0]['text']) > 500:
                print("...")
            print("-" * 80)
            
    except ValueError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error extracting PDF: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
