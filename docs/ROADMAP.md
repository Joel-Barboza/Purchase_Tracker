# Product Roadmap

This roadmap describes the incremental development of an offline-first
receipt parsing and expense tracking application.

It focuses on **capabilities and data maturity**, not UI polish.

---

## Phase 0 — Receipt Ingestion & OCR

Goal:
Capture receipt images and extract raw text locally.

Scope:
- Camera capture
- Gallery image selection
- On-device OCR execution
- Storage of raw OCR output and receipt metadata

Outcome:
The system can reliably extract raw text blocks from a receipt image.

---

## Phase 1 — Text Structuring & Parsing (Critical)

Goal:
Convert raw OCR output into structured, interpretable data.

Scope:
- Vertical and horizontal line ordering
- Line merging based on spatial proximity
- Noise filtering (headers, URLs, metadata)
- Identification of candidate product lines
- Regex-based parsing for:
  - Product codes
  - Product names
  - Quantities
  - Unit prices
  - Total prices
  - Weight-based products

Outcome:
OCR text is transformed into structured product candidates with high recall.

---

## Phase 2 — Purchase Construction & Persistence

Goal:
Persist parsed data into a normalized local data model.

Scope:
- Purchase creation
- Product deduplication by product code
- Historical price tracking
- Purchase-item association
- Local database persistence

Outcome:
Each receipt produces a complete, queryable purchase record.

---

## Phase 3 — Manual Review & Correction

Goal:
Allow the user to correct unavoidable OCR and parsing errors.

Scope:
- Editable product names
- Editable quantities and prices
- Confirmation before persistence
- Preservation of original extracted data

Outcome:
User trust is established through transparency and control.

---

## Phase 4 — Product Categorization (Rules First)

Goal:
Assign semantic meaning to products for analysis.

Scope:
- Rule-based categorization using:
  - Keywords
  - Product codes
- Manual category reassignment
- Persistence of user corrections

Outcome:
Spending can be analyzed by category with acceptable accuracy.

---

## Phase 5 — Spending Analysis & Insights

Goal:
Provide value through aggregated insights.

Scope:
- Spending per category
- Time-based filtering
- Basic summaries

Outcome:
The app fulfills its core purpose: awareness of spending habits.

---

## Future Phases (Explicitly Out of Scope)

- Cloud synchronization
- Cross-device support
- Server-side ML
- Paid APIs or services
