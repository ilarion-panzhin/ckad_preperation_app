import { Routes } from '@angular/router';
import { WikiShellComponent } from './features/wiki/components/wiki-shell.component';

export const routes: Routes = [
  { path: '', redirectTo: 'topic/kubectl-essentials/overview', pathMatch: 'full' },
  { path: 'topic/:id/:tab', component: WikiShellComponent },
  { path: '**', redirectTo: 'topic/kubectl-essentials/overview' }
];
