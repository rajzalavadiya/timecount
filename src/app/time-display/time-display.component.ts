

// src/app/time-display/time-display.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimeTrackerService } from '../time-tracker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-time-display',
  standalone:true,
  imports:[],
  providers:[TimeTrackerService],
  templateUrl: './time-display.component.html',
  styleUrls: ['./time-display.component.css']
})
export class TimeDisplayComponent implements OnInit, OnDestroy {
  totalTime: number= 0;
  private timeSubscription: Subscription | undefined;

  constructor(private timeTrackerService: TimeTrackerService) {}

  ngOnInit(): void {
    this.timeSubscription = this.timeTrackerService.timeUpdate$.subscribe(
      (totalTime) => {
        this.totalTime = totalTime;
      }
    );
  }

  ngOnDestroy(): void {
    if(this.timeSubscription != undefined){
      this.timeSubscription.unsubscribe();
    }
   
  }

  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }
}


