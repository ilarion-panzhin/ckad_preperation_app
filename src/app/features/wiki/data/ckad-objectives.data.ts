import { CkadObjectiveDomain } from '../models/wiki.models';

export const CKAD_OBJECTIVE_DOMAINS: CkadObjectiveDomain[] = [
  {
    name: 'Application Design and Build',
    weight: '20%',
    targetScore: 'Strong',
    keySkills: [
      'Write Pod/Deployment manifests quickly using dry-run YAML workflows.',
      'Work with init containers and sidecar patterns.',
      'Tune resources, probes, labels, and selectors without schema mistakes.'
    ]
  },
  {
    name: 'Application Deployment',
    weight: '20%',
    targetScore: 'Strong',
    keySkills: [
      'Execute rollout, rollback, and update strategy operations under timer.',
      'Choose correct controller (Deployment, Job, CronJob, DaemonSet, StatefulSet).',
      'Verify rollout state and remediation paths quickly.'
    ]
  },
  {
    name: 'Application Observability and Maintenance',
    weight: '15%',
    targetScore: 'Strong',
    keySkills: [
      'Use events/logs/describe systematically for troubleshooting.',
      'Configure liveness/readiness/startup probes and debug failures.',
      'Apply timer-based triage loops to avoid getting stuck.'
    ]
  },
  {
    name: 'Application Environment, Configuration and Security',
    weight: '25%',
    targetScore: 'Very strong',
    keySkills: [
      'Use ConfigMaps/Secrets via env and volumes safely.',
      'Apply ServiceAccounts, Roles, RoleBindings with least privilege.',
      'Mount volumes/PVCs and debug binding or permission issues.'
    ]
  },
  {
    name: 'Services and Networking',
    weight: '20%',
    targetScore: 'Very strong',
    keySkills: [
      'Implement Services and validate endpoints/DNS behavior.',
      'Author Ingress host/path routing correctly.',
      'Apply and test NetworkPolicies for ingress/egress isolation.'
    ]
  }
];
