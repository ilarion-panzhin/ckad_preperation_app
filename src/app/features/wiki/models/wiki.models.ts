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
  theory: string[];
  commands: CommandSnippet[];
  labs: Lab[];
  diagram: string;
  pitfalls: string[];
  related: string[];
}
