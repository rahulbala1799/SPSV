# SPSV Official Manual Page - Implementation Guide

## Overview
This document outlines the plan for creating a new page called "SPSV Official Manual" that will display the contents of the NTA PDF (221 pages) in a structured, web-friendly format.

## Source Material
- **File**: `images/nta.pdf`
- **Pages**: 221 pages
- **Content**: Official SPSV Manual from National Transport Authority

## Implementation Strategy

### Phase 1: PDF Analysis & Structure
1. **Extract PDF Content**
   - Extract text from all 221 pages
   - Identify major sections and chapters
   - Map page numbers to content sections
   - Identify tables, diagrams, and special formatting

2. **Content Organization**
   - Group related pages into logical sections
   - Identify main topics and subtopics
   - Create a hierarchical structure
   - Note any cross-references between sections

### Phase 2: Page Structure Design

#### Proposed Page Layout:
```
/spsv-manual (or /official-manual)
├── Hero Section
│   ├── Title: "SPSV Official Manual"
│   ├── Subtitle: "Complete guide to SPSV regulations and requirements"
│   └── Download PDF button
├── Table of Contents
│   ├── Expandable sections
│   ├── Quick navigation
│   └── Page number references
├── Content Sections
│   ├── Section 1: [Title]
│   │   ├── Pages X-Y
│   │   ├── Summary
│   │   └── Detailed content
│   ├── Section 2: [Title]
│   │   └── ...
│   └── ...
└── Navigation
    ├── Previous/Next section
    ├── Jump to section
    └── Back to top
```

### Phase 3: Content Processing

#### Section Categories (Proposed):
1. **Introduction & Overview**
   - Purpose of manual
   - How to use the manual
   - Key definitions

2. **Licensing Requirements**
   - Driver licensing
   - Vehicle requirements
   - Application process

3. **Industry Knowledge**
   - Regulations
   - Fares and pricing
   - Business operations
   - Customer service

4. **Area Knowledge**
   - Route knowledge
   - Navigation
   - Landmarks
   - Geography

5. **Test Information**
   - Test format
   - Passing requirements
   - Study guidelines

6. **Regulations & Compliance**
   - Legal requirements
   - Safety standards
   - Compliance procedures

7. **Appendices**
   - Forms
   - Contact information
   - Reference materials

### Phase 4: Technical Implementation

#### Components Needed:
1. **ManualPage Component** (`src/app/spsv-manual/page.tsx`)
   - Main page layout
   - Section rendering
   - Navigation

2. **TableOfContents Component**
   - Expandable/collapsible sections
   - Page number links
   - Active section highlighting

3. **ManualSection Component**
   - Individual section display
   - Page number indicators
   - Content formatting

4. **PDF Viewer Integration** (Optional)
   - Embed PDF viewer
   - Page-by-page navigation
   - Download functionality

#### Features to Implement:
- ✅ Search functionality
- ✅ Print-friendly styling
- ✅ Mobile-responsive design
- ✅ Section bookmarks/anchors
- ✅ Progress indicator
- ✅ "Last read" position tracking
- ✅ PDF download link

### Phase 5: Content Extraction & Summarization

#### Process:
1. **Extract Text from PDF**
   - Use PDF parsing tool/library
   - Maintain page structure
   - Preserve formatting where possible

2. **Identify Sections**
   - Look for headings, subheadings
   - Identify page breaks between topics
   - Note table of contents if present

3. **Create Summaries**
   - For each major section
   - Key points extraction
   - Important information highlighting

4. **Format for Web**
   - Convert to Markdown/HTML
   - Add proper headings
   - Format lists and tables
   - Add emphasis where needed

## Next Steps

### Immediate Actions:
1. ✅ Create this README document
2. ⏳ Extract PDF content (requires PDF parsing)
3. ⏳ Analyze structure and create section outline
4. ⏳ Design page layout and components
5. ⏳ Implement basic page structure
6. ⏳ Add content sections progressively

### Tools & Libraries Needed:
- PDF parsing: `pdf-parse`, `pdfjs-dist`, or similar
- Text processing: Node.js scripts
- Content management: Markdown or structured JSON

### Content Management Approach:

#### Option 1: Static Content
- Extract all content
- Create markdown files for each section
- Import into React components
- **Pros**: Fast, SEO-friendly, easy to maintain
- **Cons**: Large bundle size, manual updates

#### Option 2: Dynamic Content
- Store content in JSON/database
- Load sections on demand
- **Pros**: Smaller initial load, easier updates
- **Cons**: More complex, requires backend

#### Option 3: Hybrid
- Main sections as static content
- Detailed pages loaded dynamically
- **Pros**: Balanced approach
- **Cons**: More complex implementation

## Section Structure Template

```typescript
interface ManualSection {
  id: string;
  title: string;
  pageRange: { start: number; end: number };
  summary: string;
  subsections: SubSection[];
  keyPoints: string[];
  relatedSections: string[];
}

interface SubSection {
  id: string;
  title: string;
  pageNumber: number;
  content: string;
  important: boolean;
}
```

## Design Considerations

### User Experience:
- Easy navigation between sections
- Clear page number references
- Search functionality
- Mobile-friendly reading experience
- Print/export options

### Performance:
- Lazy load sections
- Optimize images/diagrams
- Minimize bundle size
- Fast page transitions

### Accessibility:
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation
- Screen reader friendly

## Questions to Discuss:

1. **Content Depth**: 
   - Full text of all 221 pages?
   - Summarized versions?
   - Key highlights only?

2. **Navigation Style**:
   - Single scrollable page?
   - Separate pages per section?
   - Accordion/collapsible sections?

3. **PDF Integration**:
   - Embed PDF viewer?
   - Link to download only?
   - Both options?

4. **Search Functionality**:
   - Full-text search?
   - Section-based search?
   - Keyword highlighting?

5. **Update Frequency**:
   - How often does the manual update?
   - Need version tracking?
   - Archive old versions?

## Estimated Timeline:

- **Phase 1** (PDF Analysis): 2-4 hours
- **Phase 2** (Structure Design): 1-2 hours
- **Phase 3** (Content Processing): 4-8 hours
- **Phase 4** (Implementation): 6-10 hours
- **Phase 5** (Testing & Refinement): 2-4 hours

**Total Estimated Time**: 15-28 hours

## Notes:

- The PDF may contain complex formatting, tables, and diagrams that need special handling
- Some content may need to be converted to images if it's not easily extractable
- Legal/compliance considerations for displaying official NTA content
- Consider adding disclaimers about official source material

---

## PDF Content Structure (221 Pages)

### Extraction Complete ✅

**Total Pages**: 221
**Total Sections**: 14

---

### Section 1: Welcome

**Page Range**: Pages 7-7 (1 pages)

**Summary**: The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 7  WELCOME   Welcome to The Official Manual for Operating in the SPSV Industry . SPSV i...

**Key Topics**:
- Welcome to The Official Manual for Operating in the SPSV Industry . SPSV is short for
- ‘small public service vehicle’ – vehicles that are used to carry up to eight passengers,
- excluding the driver, for hire or payment.  SPSVs play an important part in the
- delivery of public transport services. The term SPSV includes:
- › Wheelchair accessible taxis

**Content Preview**:

*Page 7*: The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 7  WELCOME   Welcome to The Official Manual for Operating in the SPSV Industry . SPSV is short for  ‘small public service vehicle’ – vehicles that are used to carry up to eight passengers,  excluding the driver, for hire or payment.  SPSVs play an important part in the  delivery of public transport services. The term SPSV includes:   › Taxis   › Wheelchair accessible taxis   › Hackney...

---

### Section 2: Terminology

**Page Range**: Pages 8-12 (5 pages)

**Summary**: TERMINOLOGY  ...

**Key Topics**:
- TERMINOLOGY

**Content Preview**:

*Page 8*: TERMINOLOGY...

*Page 9*: TERMINOLOGY   The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 9 TERMS USED BY THE SPSV INDUSTRY   The following terms and language are used frequently in th e Manual and the SPSV industry.   Adult Size  For seatbelt usage in a vehicle , ‘adult size’ refers to individuals over 150  centimetres and weighing 36 kilograms or more.   Calibration  Calibration ensures measurement accuracy by comparing an instrument ’s  readings directly a...

*Page 10*: TERMINOLOGY   The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 10 Global Positioning  System (GPS)  This is a highly accurate satellite -based navigation system. It lets us know  where we are and helps drivers quickly determine their precise location  and navigate from one place to another.   Initial charge  When a journey begins, the initial (starting) fare charge is already on the  taximeter. This covers the first 500 meters of a...

*[+ 2 more pages in this section]*

---

### Section 3: Chapter 1: The SPSV industry

**Page Range**: Pages 13-25 (13 pages)

**Summary**: CHAPTER  1: THE SPSV INDUSTRY    CHAPTER OVERVIEW   This chapter  gives  a general  overview  of the role of NTA  in relation  to the  small public service vehicle sector.   › About the National Trans...

**Key Topics**:
- CHAPTER  1: THE SPSV INDUSTRY
- CHAPTER OVERVIEW
- This chapter  gives  a general  overview  of the role of NTA  in relation  to the
- small public service vehicle sector.
- › About the National Transport Authority  (NTA)

**Content Preview**:

*Page 13*: CHAPTER  1: THE SPSV INDUSTRY    CHAPTER OVERVIEW   This chapter  gives  a general  overview  of the role of NTA  in relation  to the  small public service vehicle sector.     › About the National Transport Authority  (NTA)   › The importance of the SPSV industry   › Licensing vehicles, drivers , and dispatch operators   › Rules and regulation s for SPSVs and the ir drivers   › Getting an SPSV on the road   › National SPSV registers (licence database)...

*Page 14*: CHAPTER 1 – THE SPSV  INDUST RY  The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 14   1.1 ABOUT THE NATIONAL TRANSPORT AUTHORITY (NTA)    INTRODUCTION   The Manual contains the SPSV guidelines and regulations set out by the National Transport  Authority (NTA). This Manual has been created to help you apply for and maintain SPSV licences.     NOTE   The SPSV licence referred to   in th is Manual, is the licence that  allows a vehicl...

*Page 15*: CHAPTER 1 – THE SPSV  INDUST RY  The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 15  THE NTA OBJECTIVES   Here are the main  objectives of the NTA.   Promote and support the provision of  affordable high -quality services delivered  by SPSVs and their drivers.  Invest in activities that  improve and support  affordable high -quality  SPSV services .   Help increase the  connection and placement  of taxi services into the  public tr...

*[+ 10 more pages in this section]*

---

### Section 4: Chapter 2: SPSV driver licensing

**Page Range**: Pages 27-42 (16 pages)

**Summary**: CHAPTER 1 – THE SPSV  INDUST RY  The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 27  CHAPTER 2: SPSV DRIVER  LICENSING    CHAPTER OVERV...

**Key Topics**:
- CHAPTER 1 – THE SPSV  INDUST RY
- CHAPTER 2: SPSV DRIVER
- CHAPTER OVERVIEW
- This chapter explains how to get an SPSV licen ce.
- › Introduction  to the SPSV drive r licence

**Content Preview**:

*Page 27*: CHAPTER 1 – THE SPSV  INDUST RY  The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 27      CHAPTER 2: SPSV DRIVER  LICENSING    CHAPTER OVERVIEW   This chapter explains how to get an SPSV licen ce.    › Introduction  to the SPSV drive r licence   › Requirements to get an SPSV driver licence    › SPSV driver licence application process    › Renewing your SPSV driver licence    › Your rights and responsibilities...

*Page 28*: CHAPTER 2 - SPSV  DRIVER LICENSING   The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 28  2.1 INTRODUCTION  TO THE SPSV  DRIVER LICEN CE  RESPONSIBLE ORGANISATIONS   There are two organisations involved in the SPSV driver licensing process . An Garda Síochána  and  the NTA (National Transport Authority ).  AN GARDA SÍOCHÁNA  RESPONSIBILITIES   An Garda Síochána, the national police service of Ireland, is the SPSV driver  licensing a...

*Page 29*: CHAPTER 2 - SPSV  DRIVER LICENSING   The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 29   2.2 REQUIREMENTS TO GET AN SPSV DRIVER LICENCE   SPSV driver licences are given only to people who  meet the following requirements.   › An Garda Síochána have confirmed them to be a suitable person to hold an SPSV driver  licence .  › They h ave an up -to-date and official driving licence  for Class B or higher .  › They have  possessed a dri...

*[+ 13 more pages in this section]*

---

### Section 5: Chapter 3: Choosing a vehicle to use as an SPSV

**Page Range**: Pages 44-54 (11 pages)

**Summary**: CHAPTER  3: CHOOSING A VEHICLE  TO USE AS AN SPSV    CHAPTER OVERVIEW   Before buying a vehicle to use as an SPSV, make sure that it is suitable for  use as an SPSV. NTA sets the minimum standards tha...

**Key Topics**:
- CHAPTER  3: CHOOSING A VEHICLE
- TO USE AS AN SPSV
- CHAPTER OVERVIEW
- Before buying a vehicle to use as an SPSV, make sure that it is suitable for
- use as an SPSV. NTA sets the minimum standards that must be met by all

**Content Preview**:

*Page 44*: CHAPTER  3: CHOOSING A VEHICLE  TO USE AS AN SPSV    CHAPTER OVERVIEW   Before buying a vehicle to use as an SPSV, make sure that it is suitable for  use as an SPSV. NTA sets the minimum standards that must be met by all  vehicles in the SPSV fleet.   This chapter deals with the standards required for vehicles entering the  SPSV fleet and industry for the first time , either on new licences or as  replacement vehicles on existing licences.     › Vehicle standards for SPSV s  › Roadworthiness   ›...

*Page 45*: CHAPTER 3 – CHOOSI NG A VEHICLE TO USE AS AN SPSV     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 45  3.1 VEHICLE STANDARDS FOR SPSVS   There are two types of standards for SPSVs .  1 ROADWORTHINESS  STANDARDS    These make sure that the  vehicle is safe and well - maintained.  2 SPSV SPECIFIC SUITABILITY  STANDARDS   These focus on the vehicle’s  properties , age, comfort, size and  additional equipment or special  features li...

*Page 46*: CHAPTER 3 – CHOOSI NG A VEHICLE TO USE AS AN SPSV     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 46  3.3 SPSV SUITABILITY   SUITABILITY STANDARDS   To make sure SPSVs are safe and comfortable, NTA has created a clear and detailed set of rules that  all vehicles in the industry must follow.   The rules are explained in the NTA’s Initial Suitability Inspection Manual, which you can find online  at www.nationaltransport.ie . Thes...

*[+ 8 more pages in this section]*

---

### Section 6: Chapter 4: Vehicle licensing

**Page Range**: Pages 55-79 (25 pages)

**Summary**: CHAPTER 3 – CHOOSI NG A VEHICLE TO USE AS AN SPSV   The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 55  CHAPTER  4: VEHICLE LICENSING  ...

**Key Topics**:
- CHAPTER 3 – CHOOSI NG A VEHICLE TO USE AS AN SPSV
- CHAPTER  4: VEHICLE LICENSING
- CHAPTER OVERVIEW
- This chapter describes vehicle licensing procedures .
- › About the SPSV vehicle licence

**Content Preview**:

*Page 55*: CHAPTER 3 – CHOOSI NG A VEHICLE TO USE AS AN SPSV     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 55      CHAPTER  4: VEHICLE LICENSING    CHAPTER OVERVIEW   This chapter describes vehicle licensing procedures .    › About the SPSV vehicle licence    › Applying for a vehicle licence    › Renewing a vehicle licence    › Replacing an expired vehicle licence    › Changing the vehicle on a vehicle licence   › Transferring a licence...

*Page 56*: CHAPTER 4 – VEHICLE LICENSING     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 56  4.1 ABOUT THE SPSV VEHICLE LICENCE   If you want to use a vehicle as a taxi, wheelchair accessible taxi, hackney,  wheelchair accessible hackney, local area hackney, or limousine, that vehicle must  be licensed as a Small Public Service Vehicle (SPSV).   The NTA gives these licences to people or companies who meet certain rules and  conditions  an...

*Page 57*: CHAPTER 4 – VEHICLE LICENSING     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 57   Can a company or a business transfer a vehicle licence to a different company?   No. If the company is sold or taken over, the licence is automatically revoked.   Can the licence category be changed?   Yes, sometimes in certain situations. A taxi licence can be changed to a wheelchair accessible taxi  licence and vice versa. See section 4.7 Chang...

*[+ 22 more pages in this section]*

---

### Section 7: Chapter 5: Working as an SPSV operator

**Page Range**: Pages 80-102 (23 pages)

**Summary**: CHAPT ER 5: WORKING AS AN SPSV  OPERATOR    CHAPTER OVERVIEW   This chapter outlines the regulations that apply to SPSV vehicles and their  drivers.  ...

**Key Topics**:
- CHAPT ER 5: WORKING AS AN SPSV
- CHAPTER OVERVIEW
- This chapter outlines the regulations that apply to SPSV vehicles and their
- › Vehicle requirements
- › Operating an SPSV owned by another person

**Content Preview**:

*Page 80*: CHAPT ER 5: WORKING AS AN SPSV  OPERATOR    CHAPTER OVERVIEW   This chapter outlines the regulations that apply to SPSV vehicles and their  drivers.     › Vehicle requirements    › Operating an SPSV owned by another person    › Maintaining operational data    › Rules of operation    › Operating sustainably in the SPSV industry   › Using taxi ranks    › Using bus lanes    › Using your roof sign    › Using your cashless payment facility    › Refusing a passenger    › Keeping your vehicle in good c...

*Page 81*: CHAPTER 5 – WORKING AS AN SPSV OPERATOR     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 81    5.1 VEHICLE REQUIREMENTS   SPSV REGULATION COMPLIANCE   Any vehicle used as an SPSV must comply with  the SPSV regulations. If a vehicle is used as an  SPSV without a licence, both the driver and the  vehicle owner can be charged with an offence.  NOTE   It is the driver’s responsibility to make  sure the vehicle they are driving follo...

*Page 82*: CHAPTER 5 – WORKING AS AN SPSV OPERATOR     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 82 ADDITIONAL REGULATIONS   In addition to the SPSV regulations , additional regulations apply to taxis  and wheelchair accessible  taxis and hackneys.       Taxis must:      › Have a taximeter that  is calibrated and  verified with the  current National  Maximum Taxi Fare  and connected to a  working printer .  › Have a regulation roof  sig...

*[+ 20 more pages in this section]*

---

### Section 8: Chapter 6: Finding your way around

**Page Range**: Pages 104-115 (12 pages)

**Summary**: CHAPTER  6: FINDING YOUR WAY  AROUND    CHAPTER OVERVIEW   This chapter deals with ways of working out the best route to take your  passenger to his or her destination.  ...

**Key Topics**:
- CHAPTER  6: FINDING YOUR WAY
- CHAPTER OVERVIEW
- This chapter deals with ways of working out the best route to take your
- passenger to his or her destination.
- › The importance of route planning

**Content Preview**:

*Page 104*: CHAPTER  6: FINDING YOUR WAY  AROUND    CHAPTER OVERVIEW   This chapter deals with ways of working out the best route to take your  passenger to his or her destination.     › The importance of route planning                        › Planning your journey                 › Reading a map                         › How to use your  GPS...

*Page 105*: CHAPTER 6 – FINDING YOUR WAY AROUND     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 105  6.1 THE IMPORTANCE OF ROUTE PLANNING   As a professional SPSV driver, you are expected to get to a destination quickly, knowing your area  better than most road users.   Collecting and dropping off passengers safely and on time is a very important part of the job. If you  are unsure of the best route to take, you can check a map or use tech...

*Page 106*: CHAPTER 6 – FINDING YOUR WAY AROUND     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 106  › Digital technology and applications .  EXPERIENCE  AND  KNO WLEDGE    EXPERIENCE   Over time, drivers develop an understanding of the areas they operate in, for example, how long a  journey will take at different times of the day  or the best routes to take .   The longer you drive as a professional SPSV operator, the easier it will becom...

*[+ 9 more pages in this section]*

---

### Section 9: Chapter 7: Fares

**Page Range**: Pages 117-126 (10 pages)

**Summary**: CHAPTER  7: FARES    CHAPTER OVERVIEW   This chapter deals with how fares are calculated and charged for each  journey.   › Taxi fares   ...

**Key Topics**:
- CHAPTER  7: FARES
- CHAPTER OVERVIEW
- This chapter deals with how fares are calculated and charged for each
- › Taxi fares
- › Hackney and limousine fares

**Content Preview**:

*Page 117*: CHAPTER  7: FARES    CHAPTER OVERVIEW   This chapter deals with how fares are calculated and charged for each  journey.     › Taxi fares    › Hackney and limousine fares    › Getting paid    › Staying compliant...

*Page 118*: CHAPTER 7 – FARES     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 118  7.1 TAXI FARES   In 2006, a new rule was introduced to help develop and improve taxi services all over the country  –  the whole country became one single taximeter area. This means there is a standard taxi fare for  everyone across the country .   In accordance with legal requirements, NTA regularly undertakes a review of the National  Maximum Taxi Fare to...

*Page 119*: CHAPTER 7 – FARES     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 119   PRE-BOOKED TRIP   This is where a passenger has pre -booked a trip.    JOURNEY START   A pre -booked trip starts  when you meet the  passenger at the agreed  time . WHEN TO START THE TAXIMETER   You can start the meter when you arrive at the right place at the  right time, not earlier.   Delays by the passenger are charged as waiting time and any   time del...

*[+ 7 more pages in this section]*

---

### Section 10: Chapter 8: Delivering customer satisfaction

**Page Range**: Pages 127-152 (26 pages)

**Summary**: CHAPTER  8: DELIVERING  CUSTOMER SATISFACTION    CHAPTER OVERVIEW   This chapter deals with the subject of customer service.   › NTA’s role in customer service  ...

**Key Topics**:
- CHAPTER  8: DELIVERING
- CUSTOMER SATISFACTION
- CHAPTER OVERVIEW
- This chapter deals with the subject of customer service.
- › NTA’s role in customer service

**Content Preview**:

*Page 127*: CHAPTER  8: DELIVERING  CUSTOMER SATISFACTION    CHAPTER OVERVIEW   This chapter deals with the subject of customer service.     › NTA’s role in customer service   › Good customer service is good for business    › The customer’s rights and responsibilities    › Aspects of good customer service    › Assisting customers with disabilities    › Diversity and equality    › Dealing with complaints   › Dealing with difficult customers   › Lost p roperty...

*Page 128*: CHAPTER 8 – DELIVERING CUSTOMER SATISFACTION     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 128      8.1 NTA’S ROLE IN CUSTOMER SERVICE   As an SPSV operator, you are working in the service industry.  This means it is very important to give your customers a  safe, efficient and high -quality service. Good service helps  your passengers , and it helps your business too.   SPSV operators offer a special type of transport service...

*Page 129*: CHAPTER 8 – DELIVERING CUSTOMER SATISFACTION     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 129  8.2 GOOD CUSTOMER SERVICE IS GOOD FOR BUSINESS   Customers expect a professional SPSV service. When you treat passengers with  respect and you are polite and helpful, they are more likely to enjoy the ride. They  may use your service again, give you a good tip and tell family, friends and work  colleagues a bout you. High standards...

*[+ 23 more pages in this section]*

---

### Section 11: Chapter 9: Your SPSV business

**Page Range**: Pages 153-173 (21 pages)

**Summary**: CHAPTER  9: YOUR SPSV BUSINESS    CHAPTER OVERVIEW   This chapter deals with what you need to know when you are operating  an SPSV business.   › Working in the SPSV industry  ...

**Key Topics**:
- CHAPTER  9: YOUR SPSV BUSINESS
- CHAPTER OVERVIEW
- This chapter deals with what you need to know when you are operating
- an SPSV business.
- › Working in the SPSV industry

**Content Preview**:

*Page 153*: CHAPTER  9: YOUR SPSV BUSINESS    CHAPTER OVERVIEW   This chapter deals with what you need to know when you are operating  an SPSV business.     › Working in the SPSV industry   › Choosing the right business model   › Creating a business plan   › Running your own business    › Promoting your business...

*Page 154*: CHAPTER 9 – YOUR SPSV BUSINESS     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 154   9.1 WORKING IN THE SPSV INDUSTRY    There are many ways to work within the SPSV industry, with different roles, responsibilities and  opportunities. Here is an overview:    AS A DRIVER   You can obtain an SPSV driver licence and drive a licensed vehicle that you own or  one owned by someone else . You must inform NTA as to which vehicle you are...

*Page 155*: CHAPTER 9 – YOUR SPSV BUSINESS     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 155  A COMBINATION OF THE ABOVE ROLES   With the appropriate licences in the SPSV industry, you can hold multiple roles like the above. For  example, you can be both a driver and a vehicle owner, or a vehicle owner and a dispatch operator.    9.2 CHOOSING THE RIGHT BUSINESS MODEL   When you start a new SPSV business or want to grow an existing one, o...

*[+ 18 more pages in this section]*

---

### Section 12: Chapter 10: Staying safe

**Page Range**: Pages 174-195 (22 pages)

**Summary**: CHAPTER  10: STAYING SAFE    CHAPTER OVERVIEW   This chapter deals with the steps you can take to make your working life  safer, more secure , and compliant with current health and safety  legislation...

**Key Topics**:
- CHAPTER  10: STAYING SAFE
- CHAPTER OVERVIEW
- This chapter deals with the steps you can take to make your working life
- safer, more secure , and compliant with current health and safety
- legislation.

**Content Preview**:

*Page 174*: CHAPTER  10: STAYING SAFE    CHAPTER OVERVIEW   This chapter deals with the steps you can take to make your working life  safer, more secure , and compliant with current health and safety  legislation.     › NTA’s role in safety   › Looking after your own safety and that of your customers   › Looking after your personal security    › What to do in a collision or emergency   › Handling and transporting luggage and other heavy items   › Complying with regulations...

*Page 175*: CHAPTER 10 – STAYING SAFE     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 175  10.1 NTA’S ROLE IN SAFETY   NTA plays a key role in ensuring that SPSV services are professional and safe.   The regulations created by NTA focus on both driver and customer safety and provide guidelines on  how to maintain a high standard of service.   NTA outlines specific rights and responsibilities for both SPSV operators and customers to ensure...

*Page 176*: CHAPTER 10 – STAYING SAFE     The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 176 ROAD SAFETY AUTHORITY (RSA)   Area of responsibility:  Vehicle standards regulations (rules not covered by NTA)  and d riving  standards .  FURTHER INFORMATION   www.rsa.ie  and www.rsa.ie/services/learner -drivers/resources/rules -of-the-road .   HEALTH AND SAFETY AUTHORITY (HSA)   Area of responsibility:  Enforcement of the Safety, Health & Welfare...

*[+ 19 more pages in this section]*

---

### Section 13: Chapter 11: Preparing for your test

**Page Range**: Pages 197-207 (11 pages)

**Summary**: CHAPTER  11: PREPARING FOR YOUR  TEST    CHAPTER OVERVIEW   This chapter gives details of the tests within NTA’s Skills Development  Programme and how they are managed. It also provides a sample of th...

**Key Topics**:
- CHAPTER  11: PREPARING FOR YOUR
- CHAPTER OVERVIEW
- This chapter gives details of the tests within NTA’s Skills Development
- Programme and how they are managed. It also provides a sample of the
- types of questions that you can expect in these tests.

**Content Preview**:

*Page 197*: CHAPTER  11: PREPARING FOR YOUR  TEST    CHAPTER OVERVIEW   This chapter gives details of the tests within NTA’s Skills Development  Programme and how they are managed. It also provides a sample of the  types of questions that you can expect in these tests.     › Testing in the Skills Development Programme    › SPSV Driver Entry Test   › Test administration   › What you need to know for the Industry Knowledge Module   › What you need to know for the Area  Knowledge Module...

*Page 198*: CHAPTER 11 – PREPARING FOR YOUR TEST   The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 198   11.1 TESTING IN THE SKILLS DEVELOPMENT PROGRAMME   NTA has a Skills Development Programme for the SPSV industry. This programme includes tests to  check driver s’ knowledge of the industry rules and the area they work  in.    The main test in this programme is the SPSV Driver Entry Test,  which must be passed by everyone who wants an SPSV d...

*Page 199*: CHAPTER 11 – PREPARING FOR YOUR TEST   The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 199   THE AREA KNOWLEDGE MODULE   The Area Knowledge Mod ule checks if you know the area where you want to work.     The SPSV Driver Entry Test includes a tutorial which is 28  minutes in length, the Industry Knowledge Module which  is 54 minutes in length and the Area Knowledge Module  which is 36 minutes in length.   The entire test will take a...

*[+ 8 more pages in this section]*

---

### Section 14: Appendices

**Page Range**: Pages 209-221 (13 pages)

**Summary**: APPENDICES  ...

**Content Preview**:

*Page 209*: APPENDICES...

*Page 210*: APPENDIX  A: VEHICLE AGE RULES      › New licence transactions    › Licence renewal transactions    › Change of vehicle transactions    › Exchange of licence category...

*Page 211*: APPENDIX A  – VEHICLE AGE RULES   The Official Manual for Operating in the SPSV Industry - Edition 8.0, © National Transport Authority, 2025.  pg. 211 This appen dix specifically addresses t he rules that apply to the various stages of an SPSV ’s age.    A vehicle’s age is calculated from the date it was first registered in any country. This date is shown  in Box B of the vehicle’s registration certificate , also called “the logbook ”.  The maximum age a vehicle can be licensed for as an SPSV de...

*[+ 10 more pages in this section]*

---

# UI/UX Design Specification for SPSV Official Manual Page

## Overview

The SPSV Official Manual page will be a comprehensive, interactive learning platform with collapsible chapters and integrated multiple choice questions.

---

## Core Requirements

- ✅ Each chapter as a collapsible section
- ✅ 4 multiple choice questions per chapter
- ✅ Questions related to chapter content
- ✅ Access any chapter at any time
- ✅ Progress persists on page refresh (localStorage)
- ✅ Progress resets when navigating away (acceptable)

---

## Component Architecture

### 1. Main Page Component (`src/app/spsv-manual/page.tsx`)

```typescript
Features:
- Hero section with title and PDF download
- Table of Contents (sticky sidebar or top navigation)
- Chapter sections (collapsible)
- Progress indicator
- Search functionality
```

### 2. Chapter Component (`src/components/manual/ChapterSection.tsx`)

```typescript
Props:
- chapterId: string
- title: string
- pageRange: { start: number, end: number }
- content: string[]
- questions: Question[]

Features:
- Collapsible/expandable section
- Smooth scroll to chapter
- Content display with proper formatting
- Question section at bottom
- Progress tracking
```

### 3. Question Component (`src/components/manual/ChapterQuestions.tsx`)

```typescript
Props:
- chapterId: string
- questions: Question[]
- onAnswer: (chapterId, questionId, answer) => void

Features:
- 4 multiple choice questions
- Radio button selection
- Immediate feedback (optional or on submit)
- Answer persistence
- Score display
```

### 4. Progress Tracker (`src/components/manual/ProgressTracker.tsx`)

```typescript
Features:
- Overall progress percentage
- Chapters completed indicator
- Questions answered count
- Visual progress bar
```

---

## User Experience Flow

### Initial Page Load:
1. User lands on `/spsv-manual`
2. All chapters are collapsed by default
3. Table of Contents shows all chapters
4. Progress loaded from localStorage (if exists)
5. Previously answered questions show user's selections

### Interacting with Chapters:
1. User clicks on a chapter in TOC or expands a chapter section
2. Chapter smoothly scrolls into view and expands
3. User reads chapter content
4. User scrolls to bottom of chapter
5. User sees 4 multiple choice questions
6. User selects answers
7. Answers are saved to localStorage immediately
8. User can see which questions they've answered

### Navigation:
- User can jump to any chapter via TOC
- User can expand/collapse chapters independently
- User can search for specific content
- User can download PDF

### Refresh Behavior:
- **On page refresh**: All progress (answered questions) persists
- Chapter expansion state can be remembered or reset
- Answers remain visible
- Progress tracker shows current status

### Navigation Away:
- **When user navigates to different page**: Progress is cleared
- This is acceptable behavior per requirements
- On return, user starts fresh (or we can keep it - to be decided)

---

## State Management Strategy

### Local Storage Schema:

```typescript
interface ManualProgress {
  version: string; // For future updates
  timestamp: number;
  chapters: {
    [chapterId: string]: {
      expanded: boolean;
      questions: {
        [questionId: string]: {
          selectedAnswer: string;
          answeredAt: number;
          isCorrect?: boolean; // If we show immediate feedback
        }
      }
    }
  }
}
```

### React State:

```typescript
- Chapter expansion state (can sync with localStorage)
- Current search query
- Active chapter (for highlighting)
- Question answers (synced with localStorage)
```

---

## Question Format & Structure

### Question Data Model:

```typescript
interface Question {
  id: string; // Unique identifier
  chapterId: string;
  questionNumber: number; // 1-4
  question: string;
  options: {
    id: string;
    label: string;
  }[];
  correctAnswer: string; // ID of correct option
  explanation?: string; // Optional explanation shown after answering
  relatedPage?: number; // Page number where answer can be found
}
```

### Question Display:

```
┌─────────────────────────────────────────┐
│ Chapter 1: The SPSV Industry            │
│ [Content...]                            │
│                                         │
│ ─────────────────────────────────────  │
│ Test Your Knowledge                     │
│                                         │
│ Question 1 of 4                        │
│ What is the main role of the NTA?      │
│ ○ Option A                              │
│ ○ Option B                              │
│ ○ Option C                              │
│ ○ Option D                              │
│                                         │
│ [Previous] [Next] [Submit Answers]      │
│                                         │
│ Progress: 2/4 answered                  │
└─────────────────────────────────────────┘
```

---

## Visual Design Specifications

### Chapter Section:

- **Header**: 
  - Chapter title
  - Page range indicator
  - Expand/collapse icon
  - Progress indicator (X/4 questions answered)
  
- **Content Area**:
  - Formatted text with proper typography
  - Page number references
  - Images/diagrams if present
  - Print-friendly styling

- **Question Section**:
  - Clear separation from content
  - Numbered questions (1-4)
  - Radio button inputs
  - Submit/Check Answers button
  - Results display (if showing feedback)

### Color Scheme:

- **Chapter Header**: Green gradient (matching site theme)
- **Active Chapter**: Highlighted border
- **Answered Questions**: Green checkmark or indicator
- **Unanswered Questions**: Gray/neutral
- **Correct Answer**: Green highlight
- **Incorrect Answer**: Red highlight (if showing feedback)

### Responsive Design:

- **Desktop**: 
  - Sidebar TOC (sticky)
  - Full-width content
  - Questions inline with chapter
  
- **Tablet**:
  - Collapsible TOC
  - Full-width content
  - Questions below content
  
- **Mobile**:
  - Hamburger menu for TOC
  - Stacked layout
  - Questions in separate section

---

## Question Generation Strategy

### For Each Chapter:

1. **Analyze Content**: Review chapter content to identify key concepts
2. **Create Questions**: Generate 4 questions covering:
   - Key definitions (1 question)
   - Important regulations/rules (1 question)
   - Practical application (1 question)
   - Critical information (1 question)

3. **Question Types**:
   - Multiple choice (4 options)
   - One correct answer
   - Clear, unambiguous questions
   - Options should be plausible but distinct

### Example Questions for Chapter 1:

```
Q1: What does SPSV stand for?
A) Small Public Service Vehicle
B) Special Public Service Vehicle
C) Standard Public Service Vehicle
D) State Public Service Vehicle
Correct: A

Q2: Which organization is responsible for SPSV licensing?
A) Road Safety Authority
B) National Transport Authority
C) Department of Transport
D) Local Authorities
Correct: B

Q3: How many categories of SPSV are there?
A) 4
B) 5
C) 6
D) 7
Correct: C

Q4: What is the maximum passenger capacity (excluding driver) for an SPSV?
A) 6 passengers
B) 8 passengers
C) 10 passengers
D) 12 passengers
Correct: B
```

---

## Implementation Details

### localStorage Key:

```javascript
const STORAGE_KEY = 'spsv-manual-progress-v1';
```

### Persistence Logic:

```typescript
// Save progress
const saveProgress = (chapterId: string, questionId: string, answer: string) => {
  const progress = getProgress();
  if (!progress.chapters[chapterId]) {
    progress.chapters[chapterId] = { expanded: false, questions: {} };
  }
  progress.chapters[chapterId].questions[questionId] = {
    selectedAnswer: answer,
    answeredAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

// Load progress
const loadProgress = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { chapters: {} };
};

// Clear on navigation (optional)
// Can be done in useEffect cleanup or on route change
```

### Chapter Expansion State:

```typescript
// Option 1: Remember expansion state
const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
  () => loadExpandedChapters()
);

// Option 2: Reset on load (simpler)
const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
```

---

## Features to Implement

### Phase 1: Core Functionality
- [ ] Chapter collapsible sections
- [ ] Content display with formatting
- [ ] 4 questions per chapter
- [ ] Answer selection (radio buttons)
- [ ] localStorage persistence
- [ ] Progress tracking

### Phase 2: Enhanced UX
- [ ] Table of Contents with navigation
- [ ] Search functionality
- [ ] Progress indicator/bar
- [ ] Chapter completion badges
- [ ] Smooth scrolling
- [ ] Print-friendly CSS

### Phase 3: Advanced Features
- [ ] Immediate feedback on answers (optional)
- [ ] Explanation for correct answers
- [ ] Related page references
- [ ] Bookmarking favorite chapters
- [ ] Export progress report
- [ ] PDF download integration

---

## Accessibility Considerations

- **Keyboard Navigation**: 
  - Tab through chapters
  - Enter/Space to expand/collapse
  - Arrow keys for question navigation
  
- **Screen Readers**:
  - Proper ARIA labels
  - Announce question numbers
  - Announce progress
  
- **Focus Management**:
  - Visible focus indicators
  - Logical tab order
  - Skip to content links

---

## Performance Optimization

- **Lazy Loading**: Load chapter content on expand
- **Virtual Scrolling**: For long chapters (if needed)
- **Code Splitting**: Separate bundle for manual page
- **Image Optimization**: Optimize any diagrams/images
- **Debounced Search**: Prevent excessive re-renders

---

## Testing Considerations

- **Unit Tests**:
  - Question component rendering
  - Answer selection logic
  - Progress persistence
  
- **Integration Tests**:
  - Chapter expansion/collapse
  - Navigation between chapters
  - localStorage operations
  
- **E2E Tests**:
  - Complete user flow
  - Progress persistence across refresh
  - Question answering workflow

---

## Future Enhancements (Optional)

- **User Accounts**: Save progress to database
- **Analytics**: Track which chapters are most viewed
- **Comments/Notes**: Allow users to add personal notes
- **Study Mode**: Hide answers until ready
- **Timed Tests**: Add time limits for questions
- **Certificates**: Generate completion certificates

---

**Status**: Design Phase Complete - Ready for Implementation
**Last Updated**: January 2024
**Next Steps**: 
1. Create component structure
2. Implement chapter sections
3. Add question components
4. Integrate localStorage
5. Test persistence behavior
