import { MockTask } from '../models/wiki.models';

export const MOCK_TASKS: MockTask[] = [
  {
    id: 'task-deploy-svc-probes',
    title: 'Deployment + Service + readiness fix',
    difficulty: 'medium',
    timeBudgetMinutes: 12,
    tags: ['deployments', 'service', 'probes'],
    prompt: 'Create a deployment with 3 replicas, expose as ClusterIP service, then repair a broken readiness path to restore endpoints.'
  },
  {
    id: 'task-config-secret-wire',
    title: 'ConfigMap + Secret wiring',
    difficulty: 'medium',
    timeBudgetMinutes: 10,
    tags: ['configmap', 'secret', 'env'],
    prompt: 'Inject config from ConfigMap and credentials from Secret into an existing deployment using env and volume mount.'
  },
  {
    id: 'task-rollout-rollback',
    title: 'Failed rollout and rollback',
    difficulty: 'medium',
    timeBudgetMinutes: 10,
    tags: ['deployment', 'rollout', 'rollback'],
    prompt: 'Upgrade deployment image to a broken tag, detect failure, and roll back to prior working revision.'
  },
  {
    id: 'task-networkpolicy-allowlist',
    title: 'NetworkPolicy source allowlist',
    difficulty: 'hard',
    timeBudgetMinutes: 15,
    tags: ['networkpolicy', 'networking'],
    prompt: 'Apply default deny on API pods and allow ingress only from frontend namespace on one port.'
  },
  {
    id: 'task-cronjob-concurrency',
    title: 'CronJob with concurrency policy',
    difficulty: 'medium',
    timeBudgetMinutes: 9,
    tags: ['cronjob', 'jobs'],
    prompt: 'Create a CronJob every 5 minutes with concurrencyPolicy Forbid and history limits.'
  },
  {
    id: 'task-rbac-reader',
    title: 'RBAC least privilege',
    difficulty: 'medium',
    timeBudgetMinutes: 10,
    tags: ['rbac', 'serviceaccount'],
    prompt: 'Grant a service account get/list on configmaps in one namespace and verify using kubectl auth can-i.'
  },
  {
    id: 'task-pvc-persist',
    title: 'PVC persistence validation',
    difficulty: 'medium',
    timeBudgetMinutes: 12,
    tags: ['pvc', 'storage', 'volumes'],
    prompt: 'Mount PVC to deployment, write a file, restart pod, and verify data persists.'
  },
  {
    id: 'task-ingress-routing',
    title: 'Ingress host/path routing',
    difficulty: 'hard',
    timeBudgetMinutes: 14,
    tags: ['ingress', 'service', 'networking'],
    prompt: 'Route / and /api to different services under one host rule and validate using curl Host header.'
  },
  {
    id: 'task-initcontainer-failure',
    title: 'Init container troubleshooting',
    difficulty: 'easy',
    timeBudgetMinutes: 8,
    tags: ['pods', 'init', 'troubleshooting'],
    prompt: 'Fix pod stuck in Init by correcting init container command and verifying Ready status.'
  },
  {
    id: 'task-resource-quota',
    title: 'Quota-driven scheduling fix',
    difficulty: 'hard',
    timeBudgetMinutes: 15,
    tags: ['resources', 'quota'],
    prompt: 'Namespace has ResourceQuota; patch deployment resources to satisfy admission and scheduling constraints.'
  }
];
