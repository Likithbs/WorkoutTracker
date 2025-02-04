import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe } from '@angular/common';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../models/workout.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <div class="mb-4 flex flex-wrap gap-4">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (ngModelChange)="onFiltersChange()"
          placeholder="Search by name"
          class="p-2 border rounded">
        
        <select 
          [(ngModel)]="selectedType"
          (ngModelChange)="onFiltersChange()"
          class="p-2 border rounded">
          <option value="">All Types</option>
          <option *ngFor="let type of workoutTypes" [value]="type">
            {{type}}
          </option>
        </select>
      </div>

      <table class="w-full border-collapse border">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 border">User Name</th>
            <th class="p-2 border">Workout Type</th>
            <th class="p-2 border">Minutes</th>
            <th class="p-2 border">Date</th>
            <th class="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let workout of paginatedWorkouts" class="hover:bg-gray-50">
            <td class="p-2 border">{{workout.userName}}</td>
            <td class="p-2 border">{{workout.workoutType}}</td>
            <td class="p-2 border">{{workout.minutes}}</td>
            <td class="p-2 border">{{workout.date | date}}</td>
            <td class="p-2 border">
              <button 
                (click)="deleteWorkout(workout.id)"
                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-600">
          Showing {{startIndex + 1}} to {{endIndex}} of {{filteredWorkouts.length}} entries
        </div>
        
        <div class="flex gap-2">
          <button 
            (click)="previousPage()"
            [disabled]="currentPage === 0"
            class="px-3 py-1 border rounded disabled:opacity-50">
            Previous
          </button>
          
          <button 
            *ngFor="let page of pageNumbers" 
            (click)="goToPage(page)"
            [class.bg-blue-500]="currentPage === page"
            [class.text-white]="currentPage === page"
            class="px-3 py-1 border rounded">
            {{page + 1}}
          </button>
          
          <button 
            (click)="nextPage()"
            [disabled]="currentPage === totalPages - 1"
            class="px-3 py-1 border rounded disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  `
})
export class WorkoutListComponent implements OnInit {
  workouts: Workout[] = [];
  filteredWorkouts: Workout[] = [];
  workoutTypes: string[] = [];
  searchTerm = '';
  selectedType = '';
  currentPage = 0;
  pageSize = 5;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workoutService.getWorkouts().subscribe(workouts => {
      this.workouts = workouts;
      this.workoutTypes = this.workoutService.getWorkoutTypes();
      this.applyFilters();
    });
  }

  onFiltersChange(): void {
    this.currentPage = 0; // Reset to first page when filters change
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredWorkouts = this.workouts.filter(workout => {
      const matchesSearch = workout.userName.toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesType = !this.selectedType || 
        workout.workoutType === this.selectedType;
      return matchesSearch && matchesType;
    });
  }

  deleteWorkout(id: number): void {
    if (confirm('Are you sure you want to delete this workout?')) {
      this.workoutService.deleteWorkout(id);
    }
  }

  get paginatedWorkouts(): Workout[] {
    return this.filteredWorkouts.slice(this.startIndex, this.endIndex);
  }

  get startIndex(): number {
    return this.currentPage * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredWorkouts.length);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredWorkouts.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }
}
