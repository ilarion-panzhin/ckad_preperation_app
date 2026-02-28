import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Topic, TopicTab } from '../models/wiki.models';
import { WikiDataService } from '../wiki-data.service';

@Component({
  selector: 'app-wiki-shell',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wiki-shell.component.html',
  styleUrl: './wiki-shell.component.scss'
})
export class WikiShellComponent {
  readonly tabs: TopicTab[] = ['overview', 'theory', 'commands', 'labs', 'diagrams', 'pitfalls'];
  readonly query = signal('');
  readonly topicId = signal('kubectl-essentials');
  readonly currentTab = signal<TopicTab>('overview');

  readonly byDomain = this.data.topicsByDomain();
  readonly filteredTopics = computed(() => this.data.search(this.query()));
  readonly currentTopic = computed(() => this.data.getTopic(this.topicId()));

  constructor(
    private readonly data: WikiDataService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.route.paramMap.pipe(map((params) => params.get('id'))).subscribe((id) => {
      if (id) {
        this.topicId.set(id);
      }
    });

    this.route.paramMap.pipe(map((params) => params.get('tab'))).subscribe((tab) => {
      if (tab && this.tabs.includes(tab as TopicTab)) {
        this.currentTab.set(tab as TopicTab);
      }
    });
  }

  onSearch(value: string): void {
    this.query.set(value);
  }

  jumpTo(topic: Topic, tab: TopicTab = 'overview'): void {
    this.router.navigate(['/topic', topic.id, tab]);
  }

  relatedTopic(id: string): Topic | undefined {
    return this.data.getTopic(id);
  }

  asLinks(text: string): string {
    return text.replace(/\[\[([a-z0-9-#]+)\]\]/gi, (all, ref: string) => {
      const [id, anchor] = ref.split('#');
      return `<a href="/topic/${id}/overview${anchor ? `#${anchor}` : ''}">${id}</a>`;
    });
  }
}
