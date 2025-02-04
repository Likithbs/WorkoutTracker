import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Workout } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workouts: Workout[] = [];
  private workoutsSubject = new BehaviorSubject<Workout[]>([]);
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeData();
  }

  private initializeData(): void {
    // Initial default data
    const defaultData = [
      { id: 1, userName: 'John', workoutType: 'Running', minutes: 30, date: new Date() },
      { id: 2, userName: 'Alice', workoutType: 'Yoga', minutes: 45, date: new Date() },
      { id: 3, userName: 'Bob', workoutType: 'Weight Training', minutes: 60, date: new Date() }
    ];

    if (isPlatformBrowser(this.platformId)) {
      const storedData = localStorage.getItem('workouts');
      if (storedData) {
        this.workouts = JSON.parse(storedData);
      } else {
        this.workouts = defaultData;
        this.saveToLocalStorage();
      }
    } else {
      this.workouts = defaultData;
    }
    
    this.workoutsSubject.next(this.workouts);
  }

  private saveToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('workouts', JSON.stringify(this.workouts));
    }
  }

  getWorkouts(): Observable<Workout[]> {
    return this.workoutsSubject.asObservable();
  }

  addWorkout(workout: Omit<Workout, 'id' | 'date'>): void {
    const newWorkout: Workout = {
      ...workout,
      id: this.workouts.length + 1,
      date: new Date()
    };
    this.workouts.push(newWorkout);
    this.saveToLocalStorage();
    this.workoutsSubject.next(this.workouts);
  }

  getWorkoutTypes(): string[] {
    return [...new Set(this.workouts.map(w => w.workoutType))];
  }

  deleteWorkout(id: number): void {
    this.workouts = this.workouts.filter(w => w.id !== id);
    this.saveToLocalStorage();
    this.workoutsSubject.next(this.workouts);
  }

  getWorkoutStats(): Observable<any> {
    return new BehaviorSubject(this.workouts.reduce((acc, workout) => {
      if (!acc[workout.workoutType]) {
        acc[workout.workoutType] = {
          totalMinutes: 0,
          count: 0
        };
      }
      acc[workout.workoutType].totalMinutes += workout.minutes;
      acc[workout.workoutType].count += 1;
      return acc;
    }, {} as Record<string, { totalMinutes: number; count: number }>)).asObservable();
  }
}