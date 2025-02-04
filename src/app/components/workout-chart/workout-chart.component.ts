import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutService } from '../../services/workout.service';
import { Chart } from 'chart.js/auto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Workout {
  workoutType: string;
  minutes: number;
}

interface ChartData {
  minutes: number;
  count: number;
}

@Component({
  selector: 'app-workout-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <div class="mb-4">
        <select
          #chartType
          (change)="updateChartType(chartType.value)"
          class="p-2 border rounded w-full"
        >
          <option value="minutes">Total Minutes by Type</option>
          <option value="count">Workout Count by Type</option>
        </select>
      </div>
      <canvas id="workoutChart" *ngIf="!isLoading"></canvas>
      <div *ngIf="isLoading" class="text-center text-gray-500">
        Loading chart...
      </div>
      <div *ngIf="error" class="text-red-500 text-center">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    canvas {
      max-height: 400px;
    }
  `]
})
export class WorkoutChartComponent implements OnInit, OnDestroy {
  private chart: Chart | null = null;
  private destroy$ = new Subject<void>();
  
  isLoading = true;
  error: string | null = null;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.createChart('minutes');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.chart) {
      this.chart.destroy();
    }
  }

  updateChartType(type: string): void {
    this.createChart(type as 'minutes' | 'count');
  }

  private createChart(type: 'minutes' | 'count'): void {
    this.isLoading = true;
    this.error = null;

    if (this.chart) {
      this.chart.destroy();
    }

    this.workoutService.getWorkouts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (workouts: Workout[]) => {
          const chartData = this.processWorkoutData(workouts);
          this.renderChart(chartData, type);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load workout data';
          console.error('Workout data fetch error', err);
          this.isLoading = false;
        }
      });
  }

  private processWorkoutData(workouts: Workout[]): Record<string, ChartData> {
    return workouts.reduce((acc, workout) => {
      if (!acc[workout.workoutType]) {
        acc[workout.workoutType] = {
          minutes: 0,
          count: 0
        };
      }
      acc[workout.workoutType].minutes += workout.minutes;
      acc[workout.workoutType].count += 1;
      return acc;
    }, {} as Record<string, ChartData>);
  }

  private renderChart(
    chartData: Record<string, ChartData>, 
    type: 'minutes' | 'count'
  ): void {
    const labels = Object.keys(chartData);
    const data = labels.map(label => 
      type === 'minutes' ? chartData[label].minutes : chartData[label].count
    );

    this.chart = new Chart('workoutChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: type === 'minutes' ? 'Total Minutes' : 'Number of Workouts',
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: type === 'minutes' 
              ? 'Total Minutes by Workout Type' 
              : 'Number of Workouts by Type'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}