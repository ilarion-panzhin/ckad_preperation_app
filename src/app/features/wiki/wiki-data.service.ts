import { Injectable } from '@angular/core';
import { TOPICS } from './data/topics.data';
import { Topic } from './models/wiki.models';

@Injectable({ providedIn: 'root' })
export class WikiDataService {
  private readonly topics = TOPICS;

  getTopics(): Topic[] {
    return this.topics;
  }

  getTopic(id: string): Topic | undefined {
    return this.topics.find((topic) => topic.id === id);
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
