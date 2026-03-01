import { Topic } from '../models/wiki.models';

export const TOPICS: Topic[] = [
  {
    id: 'kubectl-essentials',
    domain: 'Core Concepts',
    title: 'kubectl essentials',
    tags: ['core', 'cli'],
    difficulty: 1,
    prerequisites: [],
    summary: 'Master the core commands for finding, understanding, and changing resources quickly in CKAD tasks.',
    theory: [
      'Prefer kubectl explain to discover fields directly in the exam terminal.',
      'Use wide output, label selectors, and namespaces to reduce noise.',
      'Imperative commands are fast for generation; export YAML for edits.'
    ],
    commands: [
      {
        id: 'inspect',
        cmd: 'kubectl get pods -A -o wide',
        explanation: 'Cluster-wide view for quick troubleshooting.'
      },
      {
        id: 'explain',
        cmd: 'kubectl explain deployment.spec.template.spec.containers',
        explanation: 'Drill into API fields while authoring manifests.'
      },
      {
        id: 'set-image',
        cmd: 'kubectl set image deployment/web web=nginx:1.27',
        explanation: 'Fast rollout update without hand-editing YAML.'
      }
    ],
    labs: [
      {
        goal: 'Create and inspect a deployment quickly.',
        steps: [
          'kubectl create deployment web --image=nginx:1.25',
          'kubectl get deploy,pods -l app=web',
          'kubectl rollout status deployment/web'
        ],
        verification: 'Deployment shows AVAILABLE replicas and pod is Running.',
        cleanup: 'kubectl delete deployment web',
        timeTarget: '6 minutes'
      }
    ],
    diagram: 'flowchart LR\nA[Question] --> B[kubectl get/describe]\nB --> C[kubectl explain]\nC --> D[apply patch/update]\nD --> E[verify with rollout/status]',
    pitfalls: [
      'Forgetting namespace context.',
      'Using describe only; miss machine-readable YAML via -o yaml.'
    ],
    related: ['deployments', 'configmaps-secrets']
  },
  {
    id: 'deployments',
    domain: 'Workloads',
    title: 'Deployments and rollouts',
    tags: ['workloads', 'rollout'],
    difficulty: 2,
    prerequisites: ['kubectl-essentials'],
    summary: 'Use deployments for stateless workloads and safe rolling updates.',
    theory: [
      'Deployment manages ReplicaSets and supports rolling updates and rollback.',
      'Tune strategy with maxUnavailable and maxSurge for control during upgrades.',
      'Use rollout history/status for exam-safe verification.'
    ],
    commands: [
      {
        id: 'rollout-history',
        cmd: 'kubectl rollout history deployment/api',
        explanation: 'Shows revisions that can be rolled back.'
      },
      {
        id: 'rollback',
        cmd: 'kubectl rollout undo deployment/api --to-revision=2',
        explanation: 'Rollback to known-good version.'
      }
    ],
    labs: [
      {
        goal: 'Perform a rollout and rollback.',
        steps: [
          'kubectl create deployment api --image=nginx:1.25',
          'kubectl set image deployment/api nginx=nginx:1.27',
          'kubectl rollout undo deployment/api'
        ],
        verification: 'rollout history includes multiple revisions; status is successful.',
        cleanup: 'kubectl delete deployment api',
        timeTarget: '8 minutes'
      }
    ],
    diagram: 'flowchart TD\nA[Update image] --> B[New ReplicaSet]\nB --> C[Scale up new]\nC --> D[Scale down old]\nD --> E[Stable revision]',
    pitfalls: [
      'Changing selector labels after creation breaks ownership.',
      'Not waiting for rollout status before moving on.'
    ],
    related: ['kubectl-essentials', 'services-networking']
  },
  {
    id: 'services-networking',
    domain: 'Services & Networking',
    title: 'Services and networking basics',
    tags: ['networking', 'service'],
    difficulty: 2,
    prerequisites: ['deployments'],
    summary: 'Expose pods reliably and route traffic with selectors and service types.',
    theory: [
      'Service selects pods by labels and provides stable virtual IP.',
      'ClusterIP is default internal access; NodePort exposes node-level ports.',
      'Endpoints must match selectors, otherwise traffic blackholes.'
    ],
    commands: [
      {
        id: 'expose',
        cmd: 'kubectl expose deployment api --port=80 --target-port=8080 --name=api-svc',
        explanation: 'Generate service from workload quickly.'
      },
      {
        id: 'endpoint-check',
        cmd: 'kubectl get endpoints api-svc',
        explanation: 'Confirms selected pod IPs are attached.'
      }
    ],
    labs: [
      {
        goal: 'Create service and verify endpoint wiring.',
        steps: [
          'kubectl create deployment api --image=nginx --port=80',
          'kubectl expose deployment api --name=api-svc --port=80',
          'kubectl get svc,endpoints api-svc'
        ],
        verification: 'Service has ClusterIP and endpoints list pod addresses.',
        cleanup: 'kubectl delete svc api-svc && kubectl delete deploy api',
        timeTarget: '7 minutes'
      }
    ],
    diagram: 'flowchart LR\nU[Client Pod] --> S[Service ClusterIP]\nS --> P1[Pod A]\nS --> P2[Pod B]',
    pitfalls: [
      'Mismatch between selector labels and pod labels.',
      'Assuming NodePort is required for inter-pod traffic.'
    ],
    related: ['deployments', 'network-policies']
  }
];
