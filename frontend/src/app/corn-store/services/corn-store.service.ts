import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal, OnDestroy } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PurchaseInfo } from '../interfaces/purchase-info.interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class CornStoreService implements OnDestroy {
  private http = inject(HttpClient);
  private timer: any;

  errorMessage = signal('');
  isLoading = signal(false);
  purchaseInfo = signal<PurchaseInfo | null>(null);

  private timeUpdateTrigger = signal(0);

  purchaseCount = computed(() => this.purchaseInfo()?.totalCount ?? 0);
  secondsToWait = computed(() => {

    this.timeUpdateTrigger();

    const baseSeconds = this.purchaseInfo()?.secondsUntilNextPurchase ?? 0;
    const lastUpdate = this.purchaseInfo()?.lastPurchaseTime;

    if (!lastUpdate || baseSeconds <= 0) return 0;

    const now = new Date();
    const elapsedSeconds = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / 1000
    );
    const remainingSeconds = Math.max(0, baseSeconds - elapsedSeconds);

    return remainingSeconds;
  });

  lastPurchaseTime = computed(() => {
    return this.purchaseInfo()?.lastPurchaseTime ?? null;
  });

  timeSinceLastPurchase = computed(() => {
    this.timeUpdateTrigger();

    const lastTime = this.lastPurchaseTime();
    if (!lastTime) return 'Never';

    const now = new Date();
    const totalSeconds = Math.floor(
      (now.getTime() - lastTime.getTime()) / 1000
    );

    if (totalSeconds < 60) return `${totalSeconds} seconds ago`;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s ago`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  });

  loadPurchaseInfo() {
    this.http
      .get<any>(`${baseUrl}/corn/info`)
      .pipe(
        catchError(() => {
          this.errorMessage.set('Could not load purchase info');
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          // Transform lastPurchaseTime to a Date object if it exists
          const purchaseInfo: PurchaseInfo = {
            ...data,
            lastPurchaseTime: data.lastPurchaseTime
              ? new Date(data.lastPurchaseTime)
              : null,
          };
          this.purchaseInfo.set(purchaseInfo);
          this.errorMessage.set('');

          this.startTimer();
        }
      });
  }

  buyCorn() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http
      .post<{ message: string }>(`${baseUrl}/corn`, {})
      .pipe(
        tap(() => {
          this.loadPurchaseInfo();
        }),
        catchError((error) => {
          if (error.status === 429) {
            this.errorMessage.set(error.error.error);
          } else {
            this.errorMessage.set('An error occurred. Please try again.');
          }
          this.loadPurchaseInfo();
          return of(null);
        }),
        tap(() => this.isLoading.set(false))
      )
      .subscribe();
  }


  private startTimer() {
    this.stopTimer();

    this.timer = setInterval(() => {
      this.timeUpdateTrigger.set(this.timeUpdateTrigger() + 1);
    }, 1000);
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
