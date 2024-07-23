import { Injectable, NgZone, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleMonitorService implements OnDestroy {
  private idleTimeout: any;
  private readonly idleDuration = 30 * 1000; // 30 seconds in milliseconds
  private readonly activitySubject = new Subject<boolean>();
  private eventListener = this.resetIdleTimeout.bind(this);
  private timerSubscription: Subscription | undefined;

  activity$: Observable<boolean> = this.activitySubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {
    if (isPlatformBrowser(this.platformId)) {
      this.startMonitoring();
    }
  }

  private startMonitoring() {
    this.resetIdleTimeout();
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
      window.addEventListener(event, this.eventListener);
    });
    this.startTimer();
  }

  private resetIdleTimeout() {
    clearTimeout(this.idleTimeout);
    this.setIdle(false);
    this.idleTimeout = setTimeout(() => this.setIdle(true), this.idleDuration);
  }

  private setIdle(isIdle: boolean) {
    this.ngZone.run(() => this.activitySubject.next(!isIdle));
    if (isIdle) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  private startTimer() {
    if (!this.timerSubscription || this.timerSubscription.closed) {
      this.timerSubscription = interval(1000).subscribe(() => {
        console.log('Timer running');
      });
    }
  }

  private stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
        window.removeEventListener(event, this.eventListener);
      });
      clearTimeout(this.idleTimeout);
      this.stopTimer();
    }
  }
}
