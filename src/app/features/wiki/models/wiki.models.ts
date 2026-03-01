export type TopicTab = 'overview' | 'theory' | 'commands' | 'labs' | 'diagrams' | 'pitfalls';

export interface CommandSnippet {
  id: string;
  cmd: string;
  explanation: string;
  variants?: string[];
}

export interface Lab {
  goal: string;
  steps: string[];
  verification: string;
  cleanup: string;
  timeTarget: string;
}

export interface Topic {
  id: string;
  domain: string;
  title: string;
  tags: string[];
  difficulty: 1 | 2 | 3;
  prerequisites: string[];
  summary: string;
  objectives: string[];
  theory: string[];
  commands: CommandSnippet[];
  labs: Lab[];
  diagram: string;
  pitfalls: string[];
  related: string[];
}

export interface StudyPhase {
  name: string;
  dateRange: string;
  goal: string;
  weeklyRhythm: string[];
  focus: string[];
  rules?: string[];
}

export interface CkadObjectiveDomain {
  name: string;
  weight: string;
  targetScore: 'Strong' | 'Very strong';
  keySkills: string[];
}

export interface MockTask {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeBudgetMinutes: number;
  tags: string[];
  prompt: string;
}
