# CKAD Preparation Wiki App

A small Angular standalone app scaffold for a structured CKAD study wiki.

## Features
- Sidebar navigation grouped by CKAD domain.
- Topic tabs: overview, theory, commands, labs, diagrams, pitfalls.
- Deep links through route pattern `/topic/:id/:tab`.
- Related topics panel.
- Structured topic data model for command snippets, labs, and diagrams.

## Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start local server:
   ```bash
   npm start
   ```

## Content model
Topic content lives in `src/app/features/wiki/data/topics.data.ts` and follows typed interfaces in `src/app/features/wiki/models/wiki.models.ts`.

The scaffold is intentionally static and self-contained so you can expand the CKAD content set quickly.
