import { StudyPhase } from '../models/wiki.models';

export const CKAD_STUDY_PHASES: StudyPhase[] = [
  {
    name: 'Phase 1: Foundation and Confidence',
    dateRange: 'March 2 – April 12, 2026 (6 weeks)',
    goal: 'Cover all CKAD topics to the level of “I can do it hands-on without hints”.',
    weeklyRhythm: [
      '4 weekdays, 30–45 minutes each',
      '1 weekend session: 2 hours',
      'Total: ~4–5 hours per week'
    ],
    focus: [
      'kubectl create + dry-run yaml',
      'fast YAML edits (labels, env, resources, probes)',
      'Deployment / rollout / rollback / strategy',
      'ConfigMap, Secret, Service, Ingress (basics)',
      'Jobs, CronJobs, volumes (basics), RBAC (basics)',
      'Troubleshooting: describe, logs, events'
    ]
  },
  {
    name: 'Phase 2: Speed and Exam Pace',
    dateRange: 'April 14 – May 19, 2026 (5 weeks)',
    goal: 'Solve tasks quickly, avoid getting stuck, and build muscle memory.',
    weeklyRhythm: [
      'Same rhythm: 4–5 hours per week',
      'Every training session is timed',
      'Every 2 weeks: mini mock, 60 minutes, 8–10 tasks'
    ],
    focus: [
      'Simple tasks: 6–10 minutes',
      'Medium tasks: 10–15 minutes',
      'Reduce YAML authoring and validation time'
    ],
    rules: [
      'If you are stuck for >5 minutes, mark it and move on.',
      'Do not spend 20 minutes heroically grinding one task.'
    ]
  },
  {
    name: 'Phase 3: Guilt-Free Break',
    dateRange: 'May 20 – May 30, 2026',
    goal: 'Take a full rest period before the final push.',
    weeklyRhythm: [
      'No mandatory study',
      'Optional: 10-minute command cheat-sheet review on phone'
    ],
    focus: ['Recovery before the final phase']
  },
  {
    name: 'Phase 4: Final Polish',
    dateRange: 'May 31 – exam date in June 2026',
    goal: 'Complete 2 full 2-hour mocks and close weak areas.',
    weeklyRhythm: [
      'First week of June: 1 mock (2 hours)',
      'Second week of June: 1 mock (2 hours)',
      'Between mocks: 30–45 minute weak-topic sessions'
    ],
    focus: [
      'Final YAML speed',
      'Repeat troubleshooting and networking tasks',
      'Light review only in the final 3–4 days'
    ],
    rules: [
      'Most comfortable exam slot: mid-June (June 13–20).',
      'Before booking, confirm readiness at 6–10 minute task pace.'
    ]
  }
];
