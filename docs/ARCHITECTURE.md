# Architecture and Technical Design

## Overview

The application is designed as an **offline-first mobile system** that extracts,
classifies, and stores purchase data from supermarket receipts.

All processing is performed locally on the device, including:

- Optical Character Recognition (OCR)
- Text normalization
- Product classification
- Data storage

The system prioritizes **reliability**, **performance**, and **user privacy**
over real-time synchronization or cloud-based features.

Network connectivity is not required for core functionality.
Online backup is considered an **optional, non-core feature** and may be
introduced in future iterations.

## Core Components

The application is composed of the following logical components:

1. **Input Acquisition**  
   Responsible for capturing receipt images using the device camera or selecting existing images from the gallery.

2. **OCR Processing**  
    Performs on-device optical character recognition to extract raw text from receipt images.

3. **Text Normalization**  
   Cleans and standardizes OCR output by removing noise, correcting common OCR errors, and extracting meaningful product lines.

4. **Product Classification Engine**  
   Assigns categories to extracted products using a hybrid approach combining rule-based classification and an on-device machine learning model.

5. **User Review and Correction**  
   Allows users to review and manually correct extracted and classified data before it is permanently stored.

6. **Local Data Storage**  
   Persists purchase records, product details, categories, and timestamps using on-device storage mechanisms.

## Data Flow

The application follows a fully offline, linear data processing pipeline.

Each stage transforms the data into a more structured and reliable form before it is persisted locally.

### Conceptual Data Flow Diagram

```
+----------------------------+
|        Image Input         |
| Camera / Gallery Selection |
+-------------+--------------+
              |
              v
+----------------------------+
|      OCR Extraction        |
|   (On-device ML Kit)       |
+-------------+--------------+
              |
              v
+----------------------------+
|     Text Normalization     |
| - Noise removal            |
| - Line segmentation        |
| - Price format correction  |
+-------------+--------------+
              |
              v
+----------------------------+
|   Product Classification   |
| - Category assignment      |
| - Quantity/weight parsing  |
+-------------+--------------+
              |
              v
+----------------------------+
|  User Review & Correction  |
| - Edit names               |
| - Fix prices               |
| - Adjust categories        |
+-------------+--------------+
              |
              v
+----------------------------+
|     Local Data Storage     |
| - Purchases                |
| - Products                 |
| - Categories               |
+----------------------------+
```

## Product Classification Strategy

Product classification is performed entirely offline using a **hybrid approach** that combines deterministic rules with optional lightweight machine learning techniques.

This strategy prioritizes:
- Predictability
- Low resource usage
- User control
- Progressive accuracy improvement

---

### Rule-Based Classification

The primary classification mechanism relies on deterministic rules derived from:

- Keyword matching in product names
- Known product patterns (e.g., weights, units, brand indicators)
- Receipt-specific formatting conventions

Rule-based classification provides:
- Immediate results
- Full transparency
- Consistent behavior across devices

This approach is especially effective for frequently purchased items and
well-known supermarket products.

---

### Lightweight Local Learning

To complement rule-based logic, the system may incorporate a lightweight, on-device learning component.

This component:
- Operates entirely offline
- Uses previously validated product-category mappings
- Improves classification accuracy over time

No external models or cloud services are required.

> [!NOTE]
> Machine learning predictions are treated as advisory and are only applied when confidence thresholds are met.

---

### User Feedback Loop

User corrections play a central role in the classification process.

When a user manually adjusts a product category:
- The correction is stored locally
- Future classifications for similar products are adjusted accordingly

This creates a feedback loop that adapts the system to individual shopping habits and local product variations.

---

### Limitations

Due to the offline-first constraint:
- Classification accuracy may initially be lower for uncommon or new products
- No global model updates are performed
- Improvements are local to each device

These limitations are considered acceptable trade-offs in exchange for privacy, speed, and independence from network connectivity.


