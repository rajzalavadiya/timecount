

// src/app/time-tracker.service.ts
import { Injectable, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IdleMonitorService } from './idle-monitor.service';
import { Subscription, BehaviorSubject, timer } from 'rxjs';
import { switchMap, takeUntil, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeCountingService implements OnDestroy {
  private startTime: number;
  private totalTime: number;
  private isActive: boolean;
  private activitySubscription: Subscription;
  // private timeUpdateSubject: BehaviorSubject<number>;
  private stopSubject: BehaviorSubject<void>;
  private timeUpdateSubject = new BehaviorSubject<number>(0);
  timeUpdate$ = this.timeUpdateSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private idleMonitorService: IdleMonitorService) {
    this.startTime = Date.now();
    this.totalTime = this.getStoredTime();
    this.isActive = true;
    this.timeUpdateSubject = new BehaviorSubject<number>(this.totalTime);
    this.stopSubject = new BehaviorSubject<void>(undefined);

    this.activitySubscription = this.idleMonitorService.activity$.pipe(
      switchMap((isActive) => {
        this.handleActivityChange(isActive);
        if (isActive) {
          return timer(0, 1000).pipe(
            switchMap(() => {
              this.totalTime += 1000;
              this.timeUpdateSubject.next(this.totalTime);
              return [];
            }),
            takeUntil(this.stopSubject)
          );
        } else {
          return timer(0); // No emissions when inactive
        }
      })
    ).subscribe();

    if (isPlatformBrowser(this.platformId)) {
      this.trackTime();
    }
  }

  private trackTime() {
    window.addEventListener('beforeunload', this.saveTime.bind(this));
  }

  private saveTime() {
    const endTime = Date.now();
    const sessionTime = endTime - this.startTime;
    this.totalTime += sessionTime;

    if (isPlatformBrowser(this.platformId) && window.localStorage) {
      localStorage.setItem('totalTime', this.totalTime.toString());
    }
  }

  private getStoredTime(): number {
    if (isPlatformBrowser(this.platformId) && window.localStorage) {
      const storedTime = localStorage.getItem('totalTime');
      return storedTime ? parseInt(storedTime, 10) : 0;
    }
    return 0;
  }

  public getTotalTime(): number {
    return this.totalTime;
  }

  public startCounting() {
    this.isActive = true;
    this.startTime = Date.now();
    this.stopSubject.next(); // reset stop signal
    this.activitySubscription.unsubscribe(); // unsubscribe previous subscription
    this.activitySubscription = this.idleMonitorService.activity$.pipe(
      switchMap((isActive) => {
        this.handleActivityChange(isActive);
        if (isActive) {
          return timer(0, 1000).pipe(
            switchMap(() => {
              this.totalTime += 1000;
              this.timeUpdateSubject.next(this.totalTime);
              return [];
            }),
            takeUntil(this.stopSubject)
          );
        } else {
          return timer(0); // No emissions when inactive
        }
      })
    ).subscribe();
  }

  public stopCounting() {
    this.isActive = false;
    this.stopSubject.next(); // trigger stop signal
    this.stopSubject.unsubscribe
    const currentTime = Date.now();
    const sessionTime = currentTime - this.startTime;
    this.totalTime += sessionTime;
    this.saveTime();
  }

  private handleActivityChange(isActive: boolean) {
    if (!this.isActive) {
      return;
    }

    const currentTime = Date.now();

    if (isActive && !this.isActive) {
      // User has become active
      this.startTime = currentTime;
    } else if (!isActive && this.isActive) {
      // User has become inactive
      const sessionTime = currentTime - this.startTime;
      this.totalTime += sessionTime;
      this.saveTime();
    }

    this.isActive = isActive;
  }

  ngOnDestroy() {
    this.saveTime();
    this.activitySubscription.unsubscribe();
  }
}
