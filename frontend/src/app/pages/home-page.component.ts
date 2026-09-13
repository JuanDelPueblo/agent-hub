import { Component } from '@angular/core';
import { ProjectListComponent } from '../projects/project-list.component';

@Component({
  selector: 'hub-home-page',
  standalone: true,
  imports: [ProjectListComponent],
  template: '<hub-project-list />',
  styles: ':host { display: flex; min-height: 0; flex: 1; flex-direction: column; }',
})
export class HomePageComponent {}
