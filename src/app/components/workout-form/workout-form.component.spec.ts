import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkoutFormComponent } from './workout-form.component';
import { WorkoutService } from '../../services/workout.service';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let workoutService: WorkoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        WorkoutFormComponent
      ],
      providers: [WorkoutService]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.workoutForm.valid).toBeFalsy();
  });

  it('should have a valid form when all fields are filled', () => {
    const formValues = {
      userName: 'Test User',
      workoutType: 'Running',
      minutes: 30
    };
    
    component.workoutForm.patchValue(formValues);
    expect(component.workoutForm.valid).toBeTruthy();
  });

  it('should call workoutService.addWorkout when form is submitted', () => {
    const spy = spyOn(workoutService, 'addWorkout');
    const formValues = {
      userName: 'Test User',
      workoutType: 'Running',
      minutes: 30
    };

    component.workoutForm.patchValue(formValues);
    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(formValues);
  });

  it('should reset form after successful submission', () => {
    const formValues = {
      userName: 'Test User',
      workoutType: 'Running',
      minutes: 30
    };

    component.workoutForm.patchValue(formValues);
    component.onSubmit();

    expect(component.workoutForm.value).toEqual({
      userName: null,
      workoutType: null,
      minutes: null
    });
  });
});