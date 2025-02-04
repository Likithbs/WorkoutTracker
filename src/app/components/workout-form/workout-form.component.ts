import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="workoutForm" (ngSubmit)="onSubmit()" class="p-4 bg-white rounded shadow">
      <div class="mb-4">
        <label for="userName" class="block mb-2">User Name</label>
        <input id="userName" type="text" formControlName="userName" 
               class="w-full p-2 border rounded">
      </div>
      
      <div class="mb-4">
        <label for="workoutType" class="block mb-2">Workout Type</label>
        <input id="workoutType" type="text" formControlName="workoutType" 
               class="w-full p-2 border rounded">
      </div>
      
      <div class="mb-4">
        <label for="minutes" class="block mb-2">Minutes</label>
        <input id="minutes" type="number" formControlName="minutes" 
               class="w-full p-2 border rounded">
      </div>
      
      <button type="submit" [disabled]="!workoutForm.valid"
              class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400">
        Add Workout
      </button>
    </form>
  `
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private workoutService: WorkoutService
  ) {
    this.workoutForm = this.fb.group({
      userName: ['', Validators.required],
      workoutType: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.workoutForm.valid) {
      this.workoutService.addWorkout(this.workoutForm.value);
      this.workoutForm.reset();
    }
  }
}