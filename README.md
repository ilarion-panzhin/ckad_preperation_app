# CKAD Preparation Wiki App

A structured Angular standalone app for CKAD preparation with full-topic navigation, tabbed knowledge pages, objective-weight awareness, timed drills, and a March–June 2026 preparation timeline.

## Tutor review (current state)
- **Coverage:** strong breadth across CKAD domains.
- **Hands-on quality:** good baseline (commands + labs), improved with timed mock drills.
- **Exam readiness rating:** **7.5/10** (solid foundation, needs ongoing timer-pressure repetition for 8.5+/10 readiness).

## What is included
- Sidebar navigation grouped by CKAD objective domains.
- Topic tabs: overview, theory, commands, labs, diagrams, pitfalls.
- Deep-link routing via `/topic/:id/:tab`.
- Rich topic model with objectives, command snippets, labs, and schematic diagrams.
- Right panel **CKAD objective map** with domain weight and target proficiency.
- Overview-level **recommended timed drills** per selected topic.
- Study timeline cards based on a phased plan (Mar–Jun 2026).

## Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start local server:
   ```bash
   npm start
   ```

## Content locations
- Topic schema and types: `src/app/features/wiki/models/wiki.models.ts`
- Main wiki topics: `src/app/features/wiki/data/topics.data.ts`
- Study timeline data: `src/app/features/wiki/data/study-plan.data.ts`
- CKAD objective domains and weights: `src/app/features/wiki/data/ckad-objectives.data.ts`
- Timed mock task bank: `src/app/features/wiki/data/mock-tasks.data.ts`

You can keep growing this as a local wiki by adding topic objects and timed drills using the same schema.
