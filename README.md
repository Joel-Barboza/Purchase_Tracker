# Refactor Branch (Archived)

## Purpose

This branch represents an **experimental refactor and migration attempt** of the original project.

The goal was to:
- Redesign the architecture
- Migrate the codebase to **TypeScript**
- Introduce clearer data modeling and implementation structure

During this process, it became clear that **migrating incrementally on top of the existing JavaScript codebase introduced structural inconsistencies** and unnecessary complexity.

As a result, this approach was **intentionally abandoned** in favor of a clean rewrite.

---

## Current Status

🚫 **This branch is archived and not intended to be merged.**

It is preserved because it contains **valuable non-code artifacts**, including:

- Architecture and implementation planning
- Data model definitions
- Technology stack decisions
- Roadmap and user stories
- Design reasoning that informed the rewrite decision
- Experimental parsing and classification ideas

The code present in this branch is **incomplete, inconsistent, and exploratory**.

---

## What to Use From This Branch

✅ Documentation files (source of truth for planning):
- `architecture.md`
- `implementation.md`
- `decisions.md`
- `roadmap.md`
- User stories and domain explanations

✅ Conceptual logic and experiments:
- OCR normalization ideas
- Receipt parsing strategies
- Categorization heuristics

---

## What *Not* to Use From This Branch

❌ Application structure  
❌ Build configuration  
❌ React Native setup  
❌ State management approach  
❌ Storage implementation  

These elements are being **re-implemented from scratch** in the rewrite branch.

---

## Successor Branch

Active development continues in a **clean rewrite branch**:

> `rewrite/ts`

That branch:
- Starts from a fresh React Native + TypeScript setup
- Implements the architecture defined here
- Avoids incremental migration pitfalls
- Represents the future of the project

---

## Summary

This branch documents a **failed-but-informative transition attempt**.

Its value lies in:
- Clarifying architectural goals
- Identifying migration pitfalls
- Justifying the rewrite decision

It remains part of the repository for **context, traceability, and learning**, not as an implementation baseline.
