# Project Motivation and Context

## Why?

The initial development process became disorganized, which made iteration and
maintenance difficult.

Because of this, the project was refactored following a **clear development plan**, migrating to **TypeScript** and adopting a more structured creation process.

This refactor is guided, but not limited by the article: [How to Create an App in 10 Easy Steps: From Idea to Launch](https://riseuplabs.com/how-to-create-an-app/)

---

## App Idea

### Problem it solves

The main goal of the app is to **track spending and help users reduce unnecessary expenses** by making them aware of what they are actually buying, without requiring manual data entry.

---

### Target audience and pain points

The target audience consists of people who frequently shop at large supermarkets in Costa Rica, specifically:

- Walmart  
- Palí  
- Maxi Palí  

Key pain points include:

- Manual entry of purchase data is time-consuming
- Most expense-tracking apps require an internet connection
- Misinterpretation of Costa Rican price formats
- Limited access to product-level purchase data
- Poor handling of quantity- and weight-based items

---

### Essential features vs future features

**Essential (MVP):**

- Receipt data extraction using the device camera
- Automatic product categorization
- Tracking spending per category

**Planned for later stages:**

- Spending visualizations over time
- Editing and managing extracted products and purchases
- Support for manually added purchases
- Shopping cart–related features

---

### Differentiation from existing solutions

The application differentiates itself by:

- Operating **fully offline**
- Supporting **Costa Rican receipt formats**
- Focusing on **product-level data**
- Allowing inspection and correction of extracted products
- Handling quantity- and weight-based items

---

### Monetization model

This is a **personal project** intended to be **free**.

As a result, the app avoids:
- Paid APIs
- Server-side processing
- Subscription-based services

All core functionality runs locally on the device.

---

## Implementation Constraints

The following constraints guide all technical decisions:

- Full offline operation
- No paid APIs or external services
- Local execution of OCR, classification, and storage
- Correct handling of Costa Rican currency and formatting
- Acceptable performance on mid-range mobile devices

---

## Scope and Non-Goals

### In scope

- Personal expense tracking
- Supermarket receipts from a limited set of stores
- Product-level spending analysis

### Out of scope (for now)

- Cloud synchronization or backups
- Cross-device data sharing
- International receipt formats
- Real-time price comparison
- Banking or payment system integration

## Data Model

This section defines the core data entities used by the application and their relationships. The data model is designed to support offline processing, product-level analysis, and progressive data refinement through user feedback.

---

### Receipt

A **Receipt** represents the raw input artifact captured by the user.

It preserves the original data used during processing and allows traceability and reprocessing if needed.

**Responsibilities:**
- Store the original receipt image reference
- Store raw OCR output
- Track processing status and timestamps

A receipt produces exactly one purchase.

---

### Purchase

A **Purchase** represents a single shopping event.

It acts as the aggregation unit for products extracted from a receipt.

**Responsibilities:**
- Store purchase date and time
- Store store or supermarket identifier
- Store total amount and optional tax information
- Maintain a list of associated products

A purchase contains one or more products.

---

### Product

A **Product** represents a single line item extracted from a receipt.

Products are the primary unit of classification and analysis.

**Responsibilities:**
- Store normalized product name
- Store unit price and total price
- Store quantity or weight when applicable
- Reference an assigned category
- Preserve original OCR text for traceability

Products belong to a single purchase and are classified into one category.

---

### Category

A **Category** represents a semantic grouping used for spending analysis.

Categories are stable and shared across purchases.

**Responsibilities:**
- Define category identity (e.g., Dairy, Meat, Cleaning)
- Serve as a grouping mechanism for products
- Support user-driven reassignment

A category may be associated with many products.

---

### Entity Relationships

```text
Receipt
   |
   v
Purchase
   |
   v
Product --------> Category
```
