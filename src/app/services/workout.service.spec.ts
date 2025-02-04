import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';
import { PLATFORM_ID } from '@angular/core';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WorkoutService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(WorkoutService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default data when localStorage is empty', (done) => {
    service.getWorkouts().subscribe(workouts => {
      expect(workouts.length).toBe(3); // Default 3 users
      expect(workouts[0].userName).toBe('John');
      done();
    });
  });

  it('should add new workout', (done) => {
    const newWorkout = {
      userName: 'Test User',
      workoutType: 'Running',
      minutes: 30
    };

    service.addWorkout(newWorkout);

    service.getWorkouts().subscribe(workouts => {
      const addedWorkout = workouts.find(w => w.userName === 'Test User');
      expect(addedWorkout).toBeTruthy();
      expect(addedWorkout?.minutes).toBe(30);
      done();
    });
  });

  it('should persist data to localStorage', () => {
    const newWorkout = {
      userName: 'Storage Test',
      workoutType: 'Walking',
      minutes: 45
    };

    service.addWorkout(newWorkout);

    const storedData = JSON.parse(localStorage.getItem('workouts') || '[]');
    expect(storedData.some((w: any) => w.userName === 'Storage Test')).toBe(true);
  });

  it('should get unique workout types', (done) => {
    service.getWorkouts().subscribe(() => {
      const types = service.getWorkoutTypes();
      expect(types.length).toBeGreaterThan(0);
      expect(new Set(types).size).toBe(types.length);
      done();
    });
  });
});