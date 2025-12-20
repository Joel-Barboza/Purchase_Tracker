# Architecture and Technical Design

## Overview

The application is designed as an **offline-first mobile system** that extracts, classifies, and stores purchase data from supermarket receipts.

All processing is performed locally on the device, including:

- Optical Character Recognition (OCR)
- Text normalization
- Product classification
- Data storage

The system prioritizes **reliability**, **performance**, and **user privacy** over real-time synchronization or cloud-based features.

Network connectivity is not required for core functionality.
Online backup is considered an **optional, non-core feature** and may be
introduced in future iterations.

---

## Core Components

The application is composed of the following logical components:

1. **Input Acquisition**  
   Captures receipt images using the device camera or selects existing images from the gallery.

2. **OCR Processing**  
   Performs on-device optical character recognition to extract raw text from receipt images.

3. **Text Normalization**  
   Cleans and standardizes OCR output by removing noise, correcting common OCR errors, and extracting meaningful product lines.

4. **Product Classification Engine**  
   Assigns categories to extracted products using a hybrid approach combining rule-based classification and an on-device machine learning model.

5. **User Review and Correction**  
   Allows users to review and manually correct extracted and classified data before it is persisted.

6. **Local Data Storage**  
   Persists purchase records, product details, categories, and timestamps using on-device storage mechanisms.

---

## Data Flow

The application follows a fully offline, linear data processing pipeline. Each stage transforms the data into a more structured and reliable form before it is persisted locally.

### Conceptual Data Flow Diagram

```text
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
