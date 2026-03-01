import { Injectable } from '@angular/core';
import { CKAD_OBJECTIVE_DOMAINS } from './data/ckad-objectives.data';
import { MOCK_TASKS } from './data/mock-tasks.data';
import { TOPICS } from './data/topics.data';
import { CkadObjectiveDomain, MockTask, Topic } from './models/wiki.models';

@Injectable({ providedIn: 'root' })
export class WikiDataService {
  private readonly topics = TOPICS;
  private readonly objectives = CKAD_OBJECTIVE_DOMAINS;
  private readonly mockTasks = MOCK_TASKS;

  getTopics(): Topic[] {
    return this.topics;
  }

  getTopic(id: string): Topic | undefined {
    return this.topics.find((topic) => topic.id === id);
  }

  getObjectiveDomains(): CkadObjectiveDomain[] {
    return this.objectives;
  }

  getMockTasksForTopic(topic: Topic, limit = 3): MockTask[] {
    const tagSet = new Set(topic.tags.map((tag) => tag.toLowerCase()));
    const titleWords = topic.title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

    return this.mockTasks
      .map((task) => ({
        task,
        score: task.tags.reduce((acc, tag) => acc + (tagSet.has(tag.toLowerCase()) ? 2 : 0), 0)
          + titleWords.reduce((acc, word) => acc + (task.prompt.toLowerCase().includes(word) ? 1 : 0), 0)
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.task);
  }

  search(query: string): Topic[] {
    if (!query.trim()) {
      return this.topics;
    }
    const lower = query.toLowerCase();
    return this.topics.filter((topic) =>
      topic.title.toLowerCase().includes(lower)
      || topic.tags.some((tag) => tag.includes(lower))
      || topic.summary.toLowerCase().includes(lower)
      || topic.objectives.some((objective) => objective.toLowerCase().includes(lower))
      || topic.theory.some((point) => point.toLowerCase().includes(lower))
    );
  }

  topicsByDomain(): Record<string, Topic[]> {
    return this.topics.reduce((acc, topic) => {
      acc[topic.domain] ??= [];
      acc[topic.domain].push(topic);
      return acc;
    }, {} as Record<string, Topic[]>);
  }
}
