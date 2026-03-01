import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CKAD_STUDY_PHASES } from '../data/study-plan.data';
import { CkadObjectiveDomain, MockTask, StudyPhase, Topic, TopicTab } from '../models/wiki.models';
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
  readonly phases: StudyPhase[] = CKAD_STUDY_PHASES;
  readonly objectiveDomains: CkadObjectiveDomain[] = this.data.getObjectiveDomains();

  readonly byDomain = this.data.topicsByDomain();
  readonly filteredTopics = computed(() => this.data.search(this.query()));
  readonly currentTopic = computed(() => this.data.getTopic(this.topicId()));
  readonly recommendedTasks = computed<MockTask[]>(() => {
    const topic = this.currentTopic();
    if (!topic) {
      return [];
    }
    return this.data.getMockTasksForTopic(topic, 4);
  });

  readonly tutorReview = {
    overallScore: '7.5 / 10',
    readinessLevel: 'Good baseline, not yet exam-safe under pressure',
    strengths: [
      'Broad topic coverage across all major CKAD domains.',
      'Clear hands-on orientation with command snippets and labs.',
      'Helpful timeline discipline for exam pacing.'
    ],
    gaps: [
      'Need more timed, scenario-based tasks directly linked to each topic.',
      'Need explicit objective-weight awareness to prioritize high-impact domains.',
      'Need stronger retrieval workflow for mock repetition and weak-spot tracking.'
    ]
  };

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
    return text.replace(/\[\[([a-z0-9-#]+)\]\]/gi, (_all, ref: string) => {
      const [id, anchor] = ref.split('#');
      return `<a href="/topic/${id}/overview${anchor ? `#${anchor}` : ''}">${id}</a>`;
    });
  }
}
