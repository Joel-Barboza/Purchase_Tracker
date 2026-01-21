# User Stories

This document defines user-facing behavior and system expectations
derived from real receipt-processing constraints.

---

## Phase 0 — Receipt Ingestion & OCR

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

## Phase 1 — Text Structuring & Parsing

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

## Phase 2 — Purchase Construction & Persistence

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

## Phase 3 — Manual Review & Correction

### US-010 Review extracted products
As a user  
I want to review extracted products before saving  
So that errors do not affect my data

Acceptance Criteria:
- [X] Products are editable
- [X] Original extracted text remains available

---

## Phase 4 — Categorization

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

## Phase 5 — Spending Insights

### US-013 View spending per category
As a user  
I want to see spending grouped by category  
So that I understand my habits

Acceptance Criteria:
- [ ] Aggregations reflect corrected data
- [ ] Totals match stored purchases
