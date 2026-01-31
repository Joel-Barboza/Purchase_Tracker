# Project Motivation and Context

## Why?

The initial development process became disorganized, which made iteration and maintenance difficult.

Because of this, the project was refactored following a **clear development plan**, migrating to **TypeScript** and adopting a more structured creation process.

This refactor is guided, but not limited by the article: [How to Create an App in 10 Easy Steps: From Idea to Launch](https://riseuplabs.com/how-to-create-an-app/)

# Table of Contents
- [App Idea](#app-idea)
  - [Problem it solves](#problem-it-solves)
  - [Target audience and pain points](#target-audience-and-pain-points)
  - [Essential features vs future features](#essential-features-vs-future-features)
  - [Differentiation from existing solutions](#differentiation-from-existing-solutions)
  - [Monetization model](#monetization-model)

- [Scope and Constraints](#scope-and-constraints)
  - [Implementation Constraints](#implementation-constraints)
  - [In Scope](#in-scope)
  - [Out of Scope (for now)](#out-of-scope-for-now)

- [Data Model](#data-model)
  - [Receipt](#receipt)
  - [Purchase](#purchase)
  - [Product](#product)
  - [Category](#category)
  - [Entity Relationships](#entity-relationships)

- [Technology Stack](#technology-stack)
  - [Mobile Framework](#mobile-framework)
  - [Language](#language)
  - [OCR Engine](#ocr-engine)
  - [Data Storage](#data-storage)
  - [State Management](#state-management)
  - [Styling and UI](#styling-and-ui)
  - [Optional / Future Technologies](#optional--future-technologies)

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

## Scope and Constraints

### Implementation Constraints

The following constraints guide all technical decisions:

- Full offline operation
- No paid APIs or external services
- Local execution of OCR, classification, and storage
- Correct handling of Costa Rican currency and formatting
- Acceptable performance on mid-range mobile devices

---

### In Scope

- Personal expense tracking
- Supermarket receipts from a limited set of stores
- Product-level spending analysis

---

### Out of Scope (for now)

- Cloud synchronization or backups
- Cross-device data sharing
- International receipt formats
- Real-time price comparison
- Banking or payment system integration

---

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
- Persist store or supermarket identifier
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


## Technology Stack

This section describes the technologies selected for implementing the application.
The focus is on offline-first execution, performance on mobile devices, and long-term maintainability.

---

### Mobile Framework

**React Native (TypeScript)**

The application is built using React Native with TypeScript.

This choice provides:
- Cross-platform support (Android-first, with future iOS compatibility)
- Strong ecosystem for camera, storage, and native modules
- Type safety and better refactoring guarantees through TypeScript

---

### Language

**TypeScript**

TypeScript is used across the codebase to:
- Reduce runtime errors
- Improve code readability and maintainability
- Enable safer refactoring as the project evolves

---

### OCR Engine

**On-device OCR (ML Kit)**

Optical Character Recognition is performed entirely on-device.

Key characteristics:
- No network dependency
- Low latency
- Privacy-preserving (no image upload)

The OCR output is treated as raw input and always passed through a normalization stage.

---

### Data Storage

**Local persistent storage (SQLite or equivalent)**

All data is stored locally on the device, including:
- Purchases
- Products
- Categories
- User corrections

The storage layer is designed to:
- Support structured queries
- Enable future migrations
- Work reliably without internet access

---

### State Management

**Local application state (React hooks / lightweight state management)**

State management prioritizes:
- Simplicity
- Predictability
- Clear separation between UI state and persisted data

Global state libraries are avoided unless complexity increases significantly.

---

### Styling and UI

**Platform-native UI components**

The UI follows platform conventions and accessibility guidelines.

Design goals:
- Minimal friction
- Clear review and correction flows
- Focus on data clarity rather than visual complexity

---

### Optional / Future Technologies

These are explicitly **not part of the current implementation**, but may be considered later:

- Cloud backup / synchronization
- Remote analytics
- Advanced ML models requiring server-side training
