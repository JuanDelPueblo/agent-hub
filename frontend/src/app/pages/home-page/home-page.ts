import { Component } from '@angular/core';
import { ProjectListComponent } from '../../projects/project-list/project-list';

@Component({
  selector: 'hub-home-page',
  imports: [ProjectListComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePageComponent {}
