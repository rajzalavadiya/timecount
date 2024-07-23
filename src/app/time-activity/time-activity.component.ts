
// src/app/time-display/time-display.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimeCountingService } from '../time-counting.service';

@Component({
  selector: 'app-time-activity',
  standalone: true,
  imports: [],
  templateUrl: './time-activity.component.html',
  styleUrl: './time-activity.component.css'
})
export class TimeActivityComponent {
  totalTime: number = 0;
  private timeSubscription: Subscription | undefined;

  constructor(private timeTrackerService: TimeCountingService) {}

  start() {
    this.timeTrackerService.startCounting();
  }

  stop() {
    this.timeTrackerService.stopCounting();
  }

  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }
}
