import { Component } from '@angular/core';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { WorkoutChartComponent } from './components/workout-chart/workout-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    WorkoutFormComponent,
    WorkoutListComponent,
    WorkoutChartComponent
  ],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Workout Tracker</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <app-workout-form></app-workout-form>
        <app-workout-chart></app-workout-chart>
      </div>
      <app-workout-list class="mt-8"></app-workout-list>
    </div>
  `
})


export class AppComponent {
  title = 'workout-tracker';
}

