import { Routes } from '@angular/router';
import { ChatPageComponent } from './pages/chat-page/chat-page';
import { HomePageComponent } from './pages/home-page/home-page';
import { ProjectPageComponent } from './pages/project-page/project-page';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Agent Hub' },
  {
    path: 'projects/:projectId',
    component: ProjectPageComponent,
    title: 'Project | Agent Hub',
  },
  {
    path: 'projects/:projectId/chats/:chatId',
    component: ChatPageComponent,
    title: 'Chat | Agent Hub',
  },
  { path: '**', redirectTo: '' },
];
