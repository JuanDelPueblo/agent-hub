import { Component } from '@angular/core';
import { ProjectListComponent } from '../projects/project-list.component';

@Component({ selector: 'hub-home-page', standalone: true, imports: [ProjectListComponent], template: '<hub-project-list />' })
export class HomePageComponent {}
