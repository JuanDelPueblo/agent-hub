import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page/home-page').then((module) => module.HomePageComponent),
    title: 'Batey',
  },
  {
    path: 'projects/:projectId',
    loadComponent: () =>
      import('./pages/project-page/project-page').then((module) => module.ProjectPageComponent),
    title: 'Project | Batey',
  },
  {
    path: 'projects/:projectId/chats/:chatId',
    loadComponent: () =>
      import('./pages/chat-page/chat-page').then((module) => module.ChatPageComponent),
    title: 'Chat | Batey',
  },
  {
    path: 'agents',
    loadComponent: () =>
      import('./pages/agents-page/agents-page').then((module) => module.AgentsPageComponent),
    title: 'Agents | Batey',
  },
  {
    path: 'agents/registry',
    loadComponent: () =>
      import('./pages/agent-registry-page/agent-registry-page').then(
        (module) => module.AgentRegistryPageComponent,
      ),
    title: 'Agent Registry | Batey',
  },
  { path: '**', redirectTo: '' },
];
