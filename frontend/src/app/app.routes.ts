import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page/home-page').then((module) => module.HomePageComponent),
    title: 'Pueblo Hub',
  },
  {
    path: 'projects/:projectId',
    loadComponent: () =>
      import('./pages/project-page/project-page').then((module) => module.ProjectPageComponent),
    title: 'Project | Pueblo Hub',
  },
  {
    path: 'projects/:projectId/chats/:chatId',
    loadComponent: () =>
      import('./pages/chat-page/chat-page').then((module) => module.ChatPageComponent),
    title: 'Chat | Pueblo Hub',
  },
  {
    path: 'agents',
    loadComponent: () =>
      import('./pages/agents-page/agents-page').then((module) => module.AgentsPageComponent),
    title: 'Agents | Pueblo Hub',
  },
  { path: '**', redirectTo: '' },
];
