# CKAD Preparation Wiki App

A structured Angular standalone app for CKAD preparation with full-topic navigation, tabbed knowledge pages, and a built-in March–June 2026 preparation timeline.

## What is included
- Sidebar navigation grouped by CKAD objective domains.
- Topic tabs: overview, theory, commands, labs, diagrams, pitfalls.
- Deep-link routing via `/topic/:id/:tab`.
- Rich topic model with objectives, command snippets, labs, and schematic diagrams.
- Expanded CKAD coverage including:
  - Pods, init/sidecar, deployments/rollouts
  - DaemonSet/StatefulSet/Job/CronJob
  - ConfigMaps/Secrets, ServiceAccounts/RBAC, security contexts
  - Services, Ingress, NetworkPolicies
  - Probes, logging/events, troubleshooting workflow
  - Volumes/PVC
  - Exam strategy timeline topic
- Right panel timeline cards based on your phased plan (Mar–Jun 2026).

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
- Main wiki content: `src/app/features/wiki/data/topics.data.ts`
- Study timeline data: `src/app/features/wiki/data/study-plan.data.ts`

You can keep growing this as a local wiki by adding more topic objects with the same schema.
