import { Topic } from '../models/wiki.models';

export const TOPICS: Topic[] = [
  {
    id: 'kubectl-essentials',
    domain: 'Application Design and Build',
    title: 'kubectl essentials and yaml generation',
    tags: ['kubectl', 'yaml', 'imperative'],
    difficulty: 1,
    prerequisites: [],
    summary: 'Core CLI workflow for CKAD speed: generate, edit, apply, verify.',
    objectives: [
      'Generate starter manifests fast with imperative commands.',
      'Navigate Kubernetes API fields without leaving terminal.',
      'Verify resources quickly with selectors and custom output.'
    ],
    theory: [
      'Use `kubectl create ... --dry-run=client -o yaml` to scaffold manifests.',
      'Prefer `kubectl explain` for exact field path and schema checks.',
      'Always verify with `get`, `describe`, and rollout/status commands.'
    ],
    commands: [
      { id: 'dry-run', cmd: 'kubectl create deployment web --image=nginx --dry-run=client -o yaml > deploy.yaml', explanation: 'Generate YAML rapidly for editing.' },
      { id: 'explain', cmd: 'kubectl explain pod.spec.containers.livenessProbe', explanation: 'Inspect probe field structure.' },
      { id: 'jsonpath', cmd: 'kubectl get pods -A -o jsonpath="{range .items[*]}{.metadata.namespace}{"/"}{.metadata.name}{"\n"}{end}"', explanation: 'Compact scripted listing.' }
    ],
    labs: [{
      goal: 'Create deployment manifest, patch resources/probe, apply and verify.',
      steps: [
        'Generate deployment YAML with dry-run and save file.',
        'Add requests/limits and readinessProbe manually.',
        'Apply and verify rollout + pod status.'
      ],
      verification: 'Deployment becomes Available and pod passes readiness.',
      cleanup: 'kubectl delete deploy web',
      timeTarget: '8 minutes'
    }],
    diagram: 'flowchart LR\nA[Task]-->B[dry-run yaml]\nB-->C[edit yaml]\nC-->D[kubectl apply]\nD-->E[verify status]',
    pitfalls: ['Editing live object with many `kubectl edit` retries instead of clean file flow.'],
    related: ['pods-lifecycle', 'deployments-rollouts', 'probes-healthchecks']
  },
  {
    id: 'pods-lifecycle',
    domain: 'Application Design and Build',
    title: 'pods lifecycle, restart policy, init containers',
    tags: ['pods', 'init', 'lifecycle'],
    difficulty: 1,
    prerequisites: ['kubectl-essentials'],
    summary: 'Understand pod phases and startup sequence including init containers.',
    objectives: ['Diagnose Pending/CrashLoopBackOff quickly.', 'Use init containers for ordered startup dependencies.'],
    theory: [
      'Pod phase is high level; container state gives real failure reason.',
      'Init containers run sequentially before app containers.',
      'RestartPolicy affects pod behavior outside controllers.'
    ],
    commands: [
      { id: 'describe-pod', cmd: 'kubectl describe pod app-pod', explanation: 'Events and state transition diagnostics.' },
      { id: 'logs-init', cmd: 'kubectl logs app-pod -c init-db', explanation: 'Read init container output.' }
    ],
    labs: [{
      goal: 'Fix pod blocked by failing init container.',
      steps: ['Create pod with init command typo.', 'Inspect describe/events and init logs.', 'Patch command and confirm Running state.'],
      verification: 'Pod transitions to Running and Ready=true.',
      cleanup: 'kubectl delete pod app-pod',
      timeTarget: '10 minutes'
    }],
    diagram: 'flowchart TD\nA[Pending]-->B[Init:1]\nB-->C[Init:2]\nC-->D[App containers start]\nD-->E[Ready]',
    pitfalls: ['Checking only app container logs when init container is failing.'],
    related: ['multi-container-sidecar', 'probes-healthchecks']
  },
  {
    id: 'multi-container-sidecar',
    domain: 'Application Design and Build',
    title: 'multi-container pods and sidecar pattern',
    tags: ['sidecar', 'logging', 'pod-design'],
    difficulty: 2,
    prerequisites: ['pods-lifecycle'],
    summary: 'Design pod templates with sidecars for logs, proxying, or supporting tasks.',
    objectives: ['Share volumes between containers safely.', 'Keep sidecar and app resource profiles balanced.'],
    theory: ['Containers in same pod share network namespace.', 'Use emptyDir/shared volume for file-based log shipping.', 'Define separate probes/resources per container.'],
    commands: [
      { id: 'pod-wide', cmd: 'kubectl get pod web -o yaml', explanation: 'Inspect all container definitions in one template.' },
      { id: 'logs-sidecar', cmd: 'kubectl logs web -c log-shipper', explanation: 'Validate sidecar behavior.' }
    ],
    labs: [{
      goal: 'Attach log sidecar to existing pod template.',
      steps: ['Create shared emptyDir volume.', 'Mount volume in app + sidecar.', 'Tail file from sidecar container.'],
      verification: 'Sidecar reads file content produced by app container.',
      cleanup: 'kubectl delete pod web',
      timeTarget: '12 minutes'
    }],
    diagram: 'flowchart LR\nA[App container]--writes-->V[(emptyDir)]\nV--reads-->B[Sidecar]',
    pitfalls: ['Forgetting to mount the same volume path into both containers.'],
    related: ['pods-lifecycle', 'resource-management']
  },
  {
    id: 'deployments-rollouts',
    domain: 'Application Deployment',
    title: 'deployments, rollout, rollback, strategy',
    tags: ['deployments', 'rollout', 'rollback'],
    difficulty: 2,
    prerequisites: ['kubectl-essentials'],
    summary: 'Operate stateless apps safely with controlled rolling updates.',
    objectives: ['Tune rollout speed with maxSurge/maxUnavailable.', 'Rollback quickly under failed update.'],
    theory: ['Deployments manage ReplicaSets revisions.', 'Rollout history stores revision metadata.', 'Strategy defaults may still cause short disruptions on small replica sets.'],
    commands: [
      { id: 'set-image', cmd: 'kubectl set image deploy/api api=nginx:1.27', explanation: 'Trigger new revision quickly.' },
      { id: 'history', cmd: 'kubectl rollout history deploy/api', explanation: 'See revision timeline.' },
      { id: 'undo', cmd: 'kubectl rollout undo deploy/api --to-revision=2', explanation: 'Rollback to stable revision.' }
    ],
    labs: [{
      goal: 'Perform update with strategy tuning and rollback.',
      steps: ['Patch deployment strategy (maxSurge 1, maxUnavailable 0).', 'Update image tag to broken version.', 'Detect failure and rollback.'],
      verification: 'Rollout ends at healthy old revision.',
      cleanup: 'kubectl delete deploy api',
      timeTarget: '12 minutes'
    }],
    diagram: 'flowchart TD\nA[Revision N]-->B[Create RS N+1]\nB-->C[Scale up new]\nC-->D[Scale down old]\nD-->E[Stable or rollback]',
    pitfalls: ['Ignoring rollout status and moving to next task prematurely.'],
    related: ['daemonset-statefulset-jobs', 'service-discovery']
  },
  {
    id: 'daemonset-statefulset-jobs',
    domain: 'Application Deployment',
    title: 'daemonsets, statefulsets, jobs and cronjobs',
    tags: ['daemonset', 'statefulset', 'jobs', 'cronjob'],
    difficulty: 2,
    prerequisites: ['deployments-rollouts'],
    summary: 'Pick the right workload controller based on runtime semantics.',
    objectives: ['Differentiate one-shot vs long-running controllers.', 'Author clean job/cronjob specs fast.'],
    theory: ['DaemonSet schedules one pod per node.', 'StatefulSet preserves stable identity and ordered rollout.', 'CronJob creates Jobs on schedule; concurrency policy matters.'],
    commands: [
      { id: 'create-job', cmd: 'kubectl create job pi --image=perl -- perl -Mbignum=bpi -wle "print bpi(2000)"', explanation: 'Quick one-off job.' },
      { id: 'create-cron', cmd: 'kubectl create cronjob backup --image=busybox --schedule="*/5 * * * *" -- /bin/sh -c "date; echo backup"', explanation: 'Generate cronjob manifest rapidly.' }
    ],
    labs: [{
      goal: 'Create CronJob with forbidding parallel runs.',
      steps: ['Generate CronJob YAML.', 'Set `concurrencyPolicy: Forbid` and history limits.', 'Run one manual job from cronjob for verification.'],
      verification: 'CronJob creates jobs and manual job completes.',
      cleanup: 'kubectl delete cronjob backup',
      timeTarget: '10 minutes'
    }],
    diagram: 'flowchart LR\nC[Cron schedule]-->J[Job]-->P[Pod]-->S[Complete]',
    pitfalls: ['Using Deployment for finite tasks better suited to Job/CronJob.'],
    related: ['deployments-rollouts', 'resource-management']
  },
  {
    id: 'resource-management',
    domain: 'Application Design and Build',
    title: 'resource requests, limits, quotas and limitranges',
    tags: ['resources', 'quota', 'limitrange'],
    difficulty: 2,
    prerequisites: ['kubectl-essentials'],
    summary: 'Control CPU/memory usage and enforce namespace policies.',
    objectives: ['Set requests/limits without syntax mistakes.', 'Troubleshoot OOMKilled and scheduling failures.'],
    theory: ['Requests drive scheduling; limits cap runtime usage.', 'ResourceQuota enforces aggregate namespace constraints.', 'LimitRange sets defaults/min/max per container or PVC.'],
    commands: [
      { id: 'top', cmd: 'kubectl top pod -n app', explanation: 'Observe current resource usage.' },
      { id: 'oom', cmd: 'kubectl describe pod memory-hog', explanation: 'Check OOMKilled reason/events.' }
    ],
    labs: [{
      goal: 'Apply quota and adjust pod resources to become schedulable.',
      steps: ['Create namespace quota.', 'Deploy pod exceeding request quota.', 'Patch resources to fit limits.'],
      verification: 'Pod schedules successfully under quota rules.',
      cleanup: 'kubectl delete ns quota-lab',
      timeTarget: '12 minutes'
    }],
    diagram: 'flowchart LR\nR[Requests]-->S[Scheduler]\nL[Limits]-->K[Kubelet enforcement]\nQ[Quota/LR]-->A[Admission]',
    pitfalls: ['Setting limit lower than request.', 'Forgetting resource units (Mi vs M).'],
    related: ['probes-healthchecks', 'multi-container-sidecar']
  },
  {
    id: 'configmaps-secrets',
    domain: 'Application Environment, Configuration and Security',
    title: 'configmaps and secrets',
    tags: ['configmap', 'secret', 'env'],
    difficulty: 1,
    prerequisites: ['kubectl-essentials'],
    summary: 'Inject configuration into workloads using env vars and mounted files.',
    objectives: ['Create configmaps/secrets from literals/files quickly.', 'Use envFrom and projected volumes correctly.'],
    theory: ['ConfigMap stores non-sensitive config; Secret stores sensitive data base64-encoded.', 'Mounted update behavior differs from env var snapshot behavior.', 'Use immutable config objects when frequent accidental edits are risky.'],
    commands: [
      { id: 'cm', cmd: 'kubectl create configmap app-config --from-literal=LOG_LEVEL=debug', explanation: 'Simple config creation.' },
      { id: 'secret', cmd: 'kubectl create secret generic db-auth --from-literal=username=app --from-literal=password=s3cr3t', explanation: 'Fast secret generation.' }
    ],
    labs: [{
      goal: 'Wire deployment to configmap and secret via env + volume.',
      steps: ['Create ConfigMap and Secret.', 'Patch deployment envFrom and secret volume mount.', 'Exec into pod and verify env/file content.'],
      verification: 'Pod sees expected env keys and mounted secret files.',
      cleanup: 'kubectl delete cm app-config; kubectl delete secret db-auth',
      timeTarget: '10 minutes'
    }],
    diagram: 'flowchart TD\nCM[ConfigMap]-->P[Pod env/files]\nS[Secret]-->P',
    pitfalls: ['Placing plain-text sensitive values directly in deployment YAML.'],
    related: ['security-context-rbac', 'serviceaccounts-rbac']
  },
  {
    id: 'serviceaccounts-rbac',
    domain: 'Application Environment, Configuration and Security',
    title: 'serviceaccounts and rbac basics',
    tags: ['rbac', 'sa', 'rolebinding'],
    difficulty: 2,
    prerequisites: ['kubectl-essentials'],
    summary: 'Grant least-privilege API access to workloads.',
    objectives: ['Create Role/RoleBinding quickly.', 'Validate permission with `kubectl auth can-i`.'],
    theory: ['ServiceAccount identity maps workload to API authn principal.', 'Role scope is namespace-local; ClusterRole is cluster-wide.', 'Bind only required verbs/resources for exam tasks.'],
    commands: [
      { id: 'can-i', cmd: 'kubectl auth can-i list pods --as=system:serviceaccount:dev:reader -n dev', explanation: 'Permission check without running pod.' },
      { id: 'role', cmd: 'kubectl create role pod-reader --verb=get,list,watch --resource=pods -n dev', explanation: 'Create namespaced read role.' }
    ],
    labs: [{
      goal: 'Allow app SA to read configmaps only in one namespace.',
      steps: ['Create SA and Role for configmaps get/list.', 'Create RoleBinding.', 'Verify with auth can-i impersonation.'],
      verification: '`can-i get configmaps` yes, `can-i delete pods` no.',
      cleanup: 'kubectl delete sa reader -n dev; kubectl delete role/rolebinding -n dev ...',
      timeTarget: '10 minutes'
    }],
    diagram: 'flowchart LR\nSA[ServiceAccount]-->RB[RoleBinding]\nRB-->R[Role]\nR-->API[K8s API access]',
    pitfalls: ['Creating ClusterRoleBinding when task asks namespace-only permission.'],
    related: ['configmaps-secrets', 'security-context-rbac']
  },
  {
    id: 'security-context-rbac',
    domain: 'Application Environment, Configuration and Security',
    title: 'security context and runtime hardening',
    tags: ['securityContext', 'runAsNonRoot', 'capabilities'],
    difficulty: 2,
    prerequisites: ['serviceaccounts-rbac'],
    summary: 'Set secure runtime defaults for CKAD-level workload hardening.',
    objectives: ['Apply pod/container securityContext fields correctly.', 'Drop capabilities and enforce non-root execution.'],
    theory: ['Use `runAsNonRoot`, `runAsUser`, `readOnlyRootFilesystem` when compatible.', 'Drop Linux capabilities unless required.', 'Probe failures can result from permission mismatch after hardening.'],
    commands: [
      { id: 'sec-check', cmd: 'kubectl get pod secure-app -o yaml | yq ".spec.containers[].securityContext"', explanation: 'Inspect effective settings.' },
      { id: 'events', cmd: 'kubectl describe pod secure-app', explanation: 'Permission-denied diagnosis after hardening.' }
    ],
    labs: [{
      goal: 'Harden pod to run as non-root and read-only filesystem.',
      steps: ['Patch pod securityContext fields.', 'Handle app writable path via emptyDir mount.', 'Verify pod remains Ready.'],
      verification: 'Pod runs, no permission denied loops.',
      cleanup: 'kubectl delete pod secure-app',
      timeTarget: '12 minutes'
    }],
    diagram: 'flowchart TD\nA[PodSpec]-->B[runAsNonRoot]\nA-->C[drop capabilities]\nA-->D[readOnlyRootFilesystem]',
    pitfalls: ['Setting readOnlyRootFilesystem without writable temp mount.'],
    related: ['resource-management', 'probes-healthchecks']
  },
  {
    id: 'service-discovery',
    domain: 'Services and Networking',
    title: 'services, selectors and dns discovery',
    tags: ['service', 'dns', 'selectors'],
    difficulty: 1,
    prerequisites: ['deployments-rollouts'],
    summary: 'Expose pods with stable virtual IP and DNS names.',
    objectives: ['Create Service from deployment quickly.', 'Debug missing endpoints.'],
    theory: ['Service selects pods by labels.', 'ClusterIP provides in-cluster stable endpoint.', 'CoreDNS resolves service names by namespace suffix.'],
    commands: [
      { id: 'expose', cmd: 'kubectl expose deploy api --port=80 --target-port=8080 --name=api-svc', explanation: 'Fast service generation.' },
      { id: 'ep', cmd: 'kubectl get endpoints api-svc -o wide', explanation: 'Ensure pods are attached.' }
    ],
    labs: [{
      goal: 'Fix service with zero endpoints.',
      steps: ['Create deployment and service with selector typo.', 'Inspect endpoints.', 'Patch selector to match pod labels.'],
      verification: 'Endpoints object shows backing pod IPs.',
      cleanup: 'kubectl delete svc api-svc; kubectl delete deploy api',
      timeTarget: '8 minutes'
    }],
    diagram: 'flowchart LR\nClient-->SVC[Service ClusterIP]-->Pod1\nSVC-->Pod2',
    pitfalls: ['Confusing `port` and `targetPort`.', 'Selector mismatch by one label key.'],
    related: ['ingress-basics', 'network-policies']
  },
  {
    id: 'ingress-basics',
    domain: 'Services and Networking',
    title: 'ingress basics and path routing',
    tags: ['ingress', 'http', 'routing'],
    difficulty: 2,
    prerequisites: ['service-discovery'],
    summary: 'Route external HTTP(S) traffic to services using host/path rules.',
    objectives: ['Create ingress with exact path/host requirements.', 'Validate backend service names and ports quickly.'],
    theory: ['Ingress resource requires ingress controller installed in cluster.', 'Rules map host/path to service backend.', 'PathType controls matching behavior.'],
    commands: [
      { id: 'create-ing', cmd: 'kubectl create ingress web --rule="app.example.com/=web-svc:80"', explanation: 'Generate ingress quickly.' },
      { id: 'describe-ing', cmd: 'kubectl describe ingress web', explanation: 'Inspect rule/backend status.' }
    ],
    labs: [{
      goal: 'Route `/api` and `/` to different services.',
      steps: ['Create two services + ingress paths.', 'Test with curl Host header from test pod.', 'Fix wrong backend port mapping.'],
      verification: 'Host/path routes hit correct services.',
      cleanup: 'kubectl delete ingress web',
      timeTarget: '12 minutes'
    }],
    diagram: 'flowchart LR\nClient-->Ingress\nIngress--/-->WebSvc\nIngress--/api-->ApiSvc',
    pitfalls: ['Forgetting host in curl tests when rules are host-based.'],
    related: ['service-discovery', 'network-policies']
  },
  {
    id: 'network-policies',
    domain: 'Services and Networking',
    title: 'networkpolicies for pod traffic control',
    tags: ['networkpolicy', 'ingress', 'egress'],
    difficulty: 3,
    prerequisites: ['service-discovery'],
    summary: 'Restrict pod-to-pod traffic by namespace/pod selectors and ports.',
    objectives: ['Write allow-only rules from spec language quickly.', 'Troubleshoot connectivity loss after policy apply.'],
    theory: ['Policies are additive allow rules.', 'Once any policy selects pod, default deny applies for unspecified directions.', 'Need CNI support for enforcement.'],
    commands: [
      { id: 'np', cmd: 'kubectl apply -f networkpolicy.yaml', explanation: 'Apply explicit traffic controls.' },
      { id: 'test', cmd: 'kubectl exec -it testpod -- nc -vz api-svc 80', explanation: 'Connectivity smoke test.' }
    ],
    labs: [{
      goal: 'Allow only frontend namespace to access api pods on 8080.',
      steps: ['Apply default deny ingress for api pods.', 'Add allow policy with namespaceSelector+podSelector.', 'Validate allowed vs denied source pods.'],
      verification: 'Only intended source can connect on target port.',
      cleanup: 'kubectl delete networkpolicy --all -n app',
      timeTarget: '15 minutes'
    }],
    diagram: 'flowchart LR\nFE[frontend ns]-->API\nOPS[other ns]-.denied.->API',
    pitfalls: ['Forgetting policyTypes when expecting egress control.'],
    related: ['ingress-basics', 'service-discovery']
  },
  {
    id: 'probes-healthchecks',
    domain: 'Application Observability and Maintenance',
    title: 'liveness, readiness, startup probes',
    tags: ['probes', 'health', 'observability'],
    difficulty: 2,
    prerequisites: ['pods-lifecycle'],
    summary: 'Use probes to protect traffic and self-heal unhealthy containers.',
    objectives: ['Choose correct probe type per failure mode.', 'Tune thresholds to avoid false restarts.'],
    theory: ['Readiness controls traffic inclusion.', 'Liveness restarts stuck containers.', 'Startup probe delays liveness/readiness checks for slow boot apps.'],
    commands: [
      { id: 'probe-events', cmd: 'kubectl describe pod api | sed -n "/Events/,$p"', explanation: 'Find probe failures quickly.' },
      { id: 'restart-count', cmd: 'kubectl get pod api -o jsonpath="{.status.containerStatuses[0].restartCount}"', explanation: 'Track liveness impact.' }
    ],
    labs: [{
      goal: 'Fix readiness endpoint path mismatch.',
      steps: ['Deploy app with wrong readiness path.', 'Observe readiness false and no service endpoints.', 'Patch path and confirm endpoints appear.'],
      verification: 'Pod ready and service endpoints populated.',
      cleanup: 'kubectl delete deploy,svc api',
      timeTarget: '10 minutes'
    }],
    diagram: 'flowchart TD\nStart-->StartupProbe-->ReadinessProbe-->Traffic\nReadinessProbe-->LivenessProbe-->Restart',
    pitfalls: ['Using same aggressive timings for startup and liveness on slow apps.'],
    related: ['service-discovery', 'troubleshooting-workflows']
  },
  {
    id: 'logging-monitoring',
    domain: 'Application Observability and Maintenance',
    title: 'logs, events, and basic monitoring signals',
    tags: ['logs', 'events', 'monitoring'],
    difficulty: 1,
    prerequisites: ['kubectl-essentials'],
    summary: 'Collect runtime evidence quickly to answer exam troubleshooting tasks.',
    objectives: ['Use logs/events timeline to isolate root cause.', 'Switch between namespace-wide and single pod views fast.'],
    theory: ['Events reveal scheduling/pull/probe failures chronology.', 'Container logs support `--previous` for crash loops.', 'Targeted selectors reduce noise and save time.'],
    commands: [
      { id: 'events', cmd: 'kubectl get events -n app --sort-by=.metadata.creationTimestamp', explanation: 'Ordered failure timeline.' },
      { id: 'previous', cmd: 'kubectl logs api-123 -c api --previous', explanation: 'Read terminated container logs.' }
    ],
    labs: [{
      goal: 'Diagnose image pull error and recover deployment.',
      steps: ['Create deployment with invalid image tag.', 'Inspect events + describe.', 'Patch valid image and verify rollout.'],
      verification: 'Pods become Running and no new ImagePullBackOff.',
      cleanup: 'kubectl delete deploy api',
      timeTarget: '8 minutes'
    }],
    diagram: 'flowchart LR\nIssue-->Events-->Describe-->Logs-->Fix',
    pitfalls: ['Skipping `--previous` logs in CrashLoopBackOff cases.'],
    related: ['troubleshooting-workflows', 'probes-healthchecks']
  },
  {
    id: 'troubleshooting-workflows',
    domain: 'Application Observability and Maintenance',
    title: 'troubleshooting workflows under timer',
    tags: ['debug', 'exam-speed', 'workflow'],
    difficulty: 3,
    prerequisites: ['logging-monitoring', 'probes-healthchecks'],
    summary: 'A repeatable timer-safe approach for failing pods and services.',
    objectives: ['Use 5-minute triage loop.', 'Decide when to skip and return later.'],
    theory: ['Start from symptom: not running vs not reachable.', 'Collect minimal evidence before edits.', 'If no progress in 5 minutes, mark and move on.'],
    commands: [
      { id: 'triage', cmd: 'kubectl get pod,svc,ep -n app', explanation: 'State snapshot for app reachability.' },
      { id: 'wide', cmd: 'kubectl get pod -o wide -n app', explanation: 'Node/IP context for networking diagnosis.' }
    ],
    labs: [{
      goal: 'Recover broken app: probe path + wrong service selector.',
      steps: ['Identify not-ready pods and empty endpoints.', 'Patch readiness path.', 'Patch service selector and verify curl success.'],
      verification: 'Readiness true and service returns expected response.',
      cleanup: 'Delete all resources in troubleshooting namespace.',
      timeTarget: '15 minutes'
    }],
    diagram: 'flowchart TD\nA[Symptom]-->B[State snapshot]\nB-->C[Events/logs]\nC-->D[Patch]\nD-->E[Verify]\nE-->F{>5 min?}\nF--yes-->G[mark&skip]',
    pitfalls: ['Trying multiple random fixes without first checking endpoints/events.'],
    related: ['logging-monitoring', 'network-policies', 'service-discovery']
  },
  {
    id: 'volumes-storage',
    domain: 'Application Environment, Configuration and Security',
    title: 'volumes and persistentvolumeclaim basics',
    tags: ['volumes', 'pvc', 'storage'],
    difficulty: 2,
    prerequisites: ['pods-lifecycle'],
    summary: 'Handle ephemeral and persistent storage patterns expected in CKAD.',
    objectives: ['Mount emptyDir/configMap/secret/PVC correctly.', 'Troubleshoot PVC Pending quickly.'],
    theory: ['emptyDir lifecycle tied to pod.', 'PVC requests storage class-backed persistent volume.', 'Access mode and storage class mismatches keep claim Pending.'],
    commands: [
      { id: 'pvc', cmd: 'kubectl get pvc -n app', explanation: 'Check claim binding state.' },
      { id: 'sc', cmd: 'kubectl get storageclass', explanation: 'See available provisioners/default class.' }
    ],
    labs: [{
      goal: 'Mount PVC to deployment and verify data survives pod restart.',
      steps: ['Create PVC and deployment mount.', 'Write file inside volume.', 'Delete pod and verify file still present on new pod.'],
      verification: 'File persists after pod recreation.',
      cleanup: 'kubectl delete deploy app; kubectl delete pvc app-data',
      timeTarget: '12 minutes'
    }],
    diagram: 'flowchart LR\nPod-->PVC-->PV',
    pitfalls: ['Requesting unsupported access mode/size for available storage class.'],
    related: ['configmaps-secrets', 'multi-container-sidecar']
  },
  {
    id: 'exam-strategy-timeline',
    domain: 'Exam Strategy',
    title: 'study timeline and exam execution strategy',
    tags: ['timeline', 'mock', 'strategy'],
    difficulty: 1,
    prerequisites: [],
    summary: 'Execution plan from March to June 2026, including pacing and readiness criteria.',
    objectives: ['Train with realistic weekly cadence.', 'Build timer discipline and mock exam rhythm.'],
    theory: [
      'Phase 1 (2 Mar–12 Apr): complete all objectives by hands-on repetition.',
      'Phase 2 (14 Apr–19 May): timed drills and mini-mocks every two weeks.',
      'Phase 3 (20–30 May): deliberate rest.',
      'Phase 4 (31 May–exam): two full mocks and weak area polish.'
    ],
    commands: [
      { id: 'ready-check', cmd: 'kubectl create deploy app --image=nginx --dry-run=client -o yaml', explanation: 'Baseline speed drill opener.' }
    ],
    labs: [{
      goal: 'Weekly simulation block (60 min, 8–10 tasks).',
      steps: ['Set 60 min timer.', 'Complete mixed task set across domains.', 'Mark tasks where no progress in 5 min and move on.'],
      verification: 'At least 70% tasks completed within timer by late May.',
      cleanup: 'Delete simulation namespace.',
      timeTarget: '60 minutes'
    }],
    diagram: 'flowchart LR\nMarApr[Phase1]-->AprMay[Phase2]\nAprMay-->Rest[Phase3]\nRest-->June[Phase4 + exam]',
    pitfalls: ['No timer during practice.', 'Over-investing in one hard task during mock.'],
    related: ['troubleshooting-workflows', 'kubectl-essentials']
  }
];
