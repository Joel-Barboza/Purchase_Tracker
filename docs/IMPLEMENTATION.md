# Project Motivation and Context

## Why?

The initial development process became disorganized, which made iteration and maintenance difficult.  
Because of this, I decided to refactor the project following a **clear development plan**, migrating to **TypeScript** and adopting a more structured creation process.

This refactor is guided by the article:  
[How to Create an App in 10 Easy Steps: From Idea to Launch](https://riseuplabs.com/how-to-create-an-app/)


# 1. App Idea

## Problem it solves

### What is the main goal of the app?

The main goal is to **track spending and help users reduce unnecessary expenses** by making them aware of what they are actually buying, without requiring manual data entry.

---

### Target audience and pain points

The target audience is people who frequently shop at large supermarkets in Costa Rica, specifically:

- Walmart  
- Palí  
- Maxi Palí  

The main pain points addressed are:

- Manually entering purchase data is tedious and time-consuming.
- Most expense-tracking apps require an internet connection to process receipts.
- Existing apps often misinterpret Costa Rican price formats (decimal and thousand separators).
- Product-level information is rarely accessible or editable after receipt scanning.
- Quantity and weight-based products are poorly handled.

---

### Essential features vs future features

**Essential (MVP):**

- Extract purchase data from receipts using the device camera.
- Automatically classify products into categories.
- Track the amount spent per category.

**Planned for later stages:**

- Visualization of spending trends and price evolution over time.
- Viewing and editing extracted products and purchases.
- Managing and saving products not purchased at supported supermarkets.
- Shopping cart functions.

---

### Differentiation from existing solutions

This app differs from existing alternatives in several key aspects:

- Works **fully offline**, avoiding slow network-dependent receipt processing.
- Designed specifically for **Costa Rican receipts**, correctly handling local price formats.
- Focuses on **product-level data**, not just totals, store names, or tax values.
- Allows inspection (and later editing) of individual products.
- Considers **quantity and weight-based items**, which many apps ignore.

While other apps commonly offer:

- Manual correction of extracted data
- Basic statistics
- Cloud backups
- Purchase categorization (in limited cases)

They often fail to provide accurate, transparent, and localized product information.

---

### Monetization model

This is currently a **personal project** intended to be **free**.

For that reason, the app avoids:

- Paid APIs
- Server-side processing
- Subscription-based services

All core functionality is designed to run **locally on the device**.

---

## Implementation Constraints

The following constraints directly influence architectural and technical decisions:

- The application must work **fully offline**.
- No paid APIs or external services may be used.
- All processing (OCR, classification, and storage) must run **locally on the device**.
- The app must correctly interpret **Costa Rican receipt formats**, including decimal separators and currency conventions.
- The solution should prioritize performance on mid-range mobile devices.

---

## Scope and Non-Goals

This project is intentionally focused on:

- Personal expense tracking.
- Supermarket receipts from a limited set of stores.
- Product-level analysis rather than full financial accounting.

The following are considered out of scope **for now**:

- Cloud synchronization or online backups.
- Cross-device data sharing.
- Support for all international receipt formats.
- Real-time price comparison between stores.
- Integration with banking or payment systems.
