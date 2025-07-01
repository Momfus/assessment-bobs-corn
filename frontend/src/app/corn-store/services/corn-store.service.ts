import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  computed,
  inject,
  signal,
  OnDestroy,
  effect,
} from '@angular/core';
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

  availableUsers = signal([
    { name: 'User 1', id: 'user-1' },
    { name: 'User 2', id: 'user-2' },
    { name: 'User 3', id: 'user-3' },
  ]);

  currentUser = signal(this.availableUsers()[0]);

  errorMessage = signal('');
  isLoading = signal(false);
  purchaseInfo = signal<PurchaseInfo | null>(null);

  private timeUpdateTrigger = signal(0);

  private userEffect = effect(() => {
    this.loadPurchaseInfo();
  });

  purchaseCount = computed(() => this.purchaseInfo()?.totalCount ?? 0);
  secondsToWait = computed(() => {
    this.timeUpdateTrigger();

    const baseSeconds = this.purchaseInfo()?.secondsUntilNextPurchase ?? 0;
    const lastUpdate = this.purchaseInfo()?.lastPurchaseTime;

    return lastUpdate && baseSeconds > 0
      ? Math.max(
          0,
          baseSeconds - Math.floor((Date.now() - lastUpdate.getTime()) / 1000)
        )
      : 0;
  });

  lastPurchaseTime = computed(() => {
    return this.purchaseInfo()?.lastPurchaseTime ?? null;
  });

  timeSinceLastPurchase = computed(() => {
    this.timeUpdateTrigger();

    const lastTime = this.lastPurchaseTime();
    if (!lastTime) return 'Never';

    const seconds = Math.floor((Date.now() - lastTime.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    return `${Math.floor(seconds / 3600)} hours ago`;
  });

  setCurrentUser(userId: string) {
    const user = this.availableUsers().find((u) => u.id === userId);
    if (user) {
      this.currentUser.set(user);
    }
  }

  loadPurchaseInfo() {
    const clientId = this.currentUser().id;
    this.http
      .get<PurchaseInfo>(`${baseUrl}/corn/info`, {
        params: { clientId }, // Envía como query param
      })
      .pipe(
        catchError(() => {
          this.errorMessage.set('Could not load purchase info');
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.purchaseInfo.set({
            ...data,
            lastPurchaseTime: data.lastPurchaseTime
              ? new Date(data.lastPurchaseTime)
              : null,
          });
          this.startTimer();
        }
      });
  }

  buyCorn() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.http
      .post<{ message: string }>(`${baseUrl}/corn`, {
        clientId: this.currentUser().id,
      })
      .pipe(
        tap(() => this.loadPurchaseInfo()),
        catchError((error) => {
          this.errorMessage.set(
            error.status === 429
              ? error.error.error
              : 'An error occurred. Please try again.'
          );
          this.loadPurchaseInfo();
          return of(null);
        }),
        tap(() => this.isLoading.set(false))
      )
      .subscribe();
  }

  private startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeUpdateTrigger.update((v) => v + 1);
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
