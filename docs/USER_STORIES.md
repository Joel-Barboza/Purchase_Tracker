# User Stories

This document defines user-facing behavior and system expectations
derived from real receipt-processing constraints.

---

## Phase 0 - Receipt Ingestion & OCR

### US-001 Capture receipt image
As a user  
I want to capture a receipt using my camera  
So that I can digitize my purchase without manual entry

Acceptance Criteria:
- [X] Camera access is available
- [X] Image is stored locally
- [X] Captured image URI is stored and linked to a receipt record

---

### US-002 Select receipt from gallery
As a user  
I want to select a receipt image from my gallery  
So that I can process receipts taken earlier

Acceptance Criteria:
- [X] Gallery picker is supported
- [X] Selected image follows the same pipeline as camera images

---

### US-003 Perform offline OCR
As a user  
I want text extracted from my receipt without internet access  
So that my data remains private

Acceptance Criteria:
- [X] OCR output (blocks, lines, and elements) is serialized
- [X] Serialized OCR data is stored locally (SQLite)
- [X] Receipt references both the original image path and OCR data


---

## Phase 1 - Text Structuring & Parsing

### US-004 Structure OCR text spatially
As a system  
I want OCR lines ordered vertically and horizontally  
So that textual meaning is preserved

Acceptance Criteria:
- [X] Lines are sorted by vertical position
- [X] Elements within lines are sorted horizontally
- [X] Visually continuous lines are merged

---

### US-005 Filter non-product content
As a system  
I want to discard irrelevant receipt text  
So that parsing focuses on products only

Acceptance Criteria:
- [X] Headers, URLs, and metadata are ignored
- [X] Filtering does not remove valid product lines

---

### US-006 Identify product candidates
As a system  
I want to detect lines containing product identifiers  
So that products can be extracted reliably

Acceptance Criteria:
- [X] Product codes are detected via patterns
- [X] Candidate lines are flagged for parsing

---

### US-007 Parse product details
As a system  
I want to extract product attributes from receipt text  
So that purchases can be reconstructed

Acceptance Criteria:
- [X] Product name is extracted
- [X] Quantity is inferred or defaulted
- [X] Unit price and total price are parsed
- [X] Weight-based products are handled explicitly

---

## Phase 2 - Purchase Construction & Persistence

### US-008 Create a purchase record
As a user  
I want each receipt to become a purchase  
So that my shopping history is preserved

Acceptance Criteria:
- [X] Purchase's scan date is stored
- [X] Purchase contains one or more products

---

### US-009 Deduplicate products by code
As a system  
I want to reuse existing products when possible  
So that product history remains consistent

Acceptance Criteria:
- [X] Products are matched by product code
- [X] Prices are updated when needed

---

## Phase 3 - Manual Review & Correction

### US-010 Review extracted products
As a user  
I want to review extracted products before saving  
So that errors do not affect my data

Acceptance Criteria:
- [X] Products are editable
- [X] Original extracted text remains available

---

## Phase 4 - Categorization

### US-011 Automatic product categorization
As a user  
I want products categorized automatically  
So that spending analysis is meaningful

Acceptance Criteria:
- [X] Rule-based categorization runs offline
- [X] Unknown products fall back to a safe category

---

### US-012 Manual category correction
As a user  
I want to change a product’s category  
So that misclassifications don’t persist

Acceptance Criteria:
- [X] Category changes are saved
- [X] Corrections influence future behavior

---

## Phase 5 - Spending Insights

### US-013 View spending per category
As a user  
I want to see spending grouped by category  
So that I understand my habits

Acceptance Criteria:
- [X] Aggregations reflect corrected data
- [X] Totals match stored purchases

---

## Phase 5.5 - Dedicated product review & correction

### US-014 Open product edit screen
As a user  
I want to open a dedicated screen to edit a product  
So that I can focus on correcting its details without distractions

Acceptance Criteria:
- [X] Tapping a product opens a full-screen edit view
- [X] The edit screen replaces the modal
- [X] Navigation back returns me to the product list
- [X] Unsaved changes are discarded unless I save

---

### US-015 View product context on receipt image

As a user  
I want to see the selected product’s frame on the receipt image while editing  
So that I understand where the extracted values came from

Acceptance Criteria:

- [X] The product section in the image is visible on the edit screen
- [X] Only the selected product’s region is shown
- [X] Selection updates when switching products

---

## Phase 5.9 - Extra features for a better first MVP.

### US-016 - Modify list of OCR extracted products

As a user  
I want to add and delete products from a purchase before storing it  
So that I save the purchase data with the complete and proper products

Acceptance Criteria: 

- [X] Lines mistakenly categorized as product can be deleted from screen.
- [X] Deleted products are not saved to DB.
- [X] Add products if they were missed by OCR.
- [X] Added products appear on ProductReviewScreen
- [X] Added products are saved to DB.

---

### US-017 - Product screen

As a user   
I want a screen where I can see the products stored   
So that I can check prices  

- [ ] Each product item shows just the name and price
- [ ] Latest products are shown first
- [ ] Products can be clicked to show the rest of the data related to that product

--- 
### US-018 - Purchase Screen

As a user  
I want a scree where I can see the purchases store   
So that I can check how much I paid on certain purchases

- [ ] Each purchase shows just the date, store and total paid
- [ ] Latest purchases are shown first
- [ ] Purchases can be clicked show the list of products and other details
