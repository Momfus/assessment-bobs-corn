import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
  OnDestroy,
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
  private readonly RATE_LIMIT_MS = 60000;

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

  // Effect to load purchase info on initialization
  private userChangeEffect = effect(() => {
    const userId = this.currentUser().id;
    this.loadPurchaseInfo();
    this.startTimer();
  });

  purchaseCount = computed(() => this.purchaseInfo()?.totalCount ?? 0);

  secondsToWait = computed(() => {
    this.timeUpdateTrigger();
    if (!this.purchaseInfo()?.lastPurchaseTime) return 0;

    const now = Date.now();
    const lastPurchaseTime = new Date(
      this.purchaseInfo()!.lastPurchaseTime!
    ).getTime();
    const elapsedMs = now - lastPurchaseTime;
    const remainingMs = Math.max(0, this.RATE_LIMIT_MS - elapsedMs);

    return Math.ceil(remainingMs / 1000);
  });

  canBuy = computed(() => this.secondsToWait() === 0);

  timeSinceLastPurchase = computed(() => {
    this.timeUpdateTrigger(); // Reacciona a cambios
    if (!this.purchaseInfo()?.lastPurchaseTime) return 'Never';

    const lastTime = new Date(this.purchaseInfo()!.lastPurchaseTime!).getTime();
    const seconds = Math.floor((Date.now() - lastTime) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    return `${Math.floor(seconds / 3600)} hours ago`;
  });

  loadPurchaseInfo() {
    const clientId = this.currentUser().id;
    this.http
      .get<PurchaseInfo>(`${baseUrl}/corn/info`, {
        params: { clientId },
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
        }
      });
  }

  buyCorn() {
    if (!this.canBuy() || this.isLoading()) return;

    this.isLoading.set(true);
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

  setCurrentUser(userId: string) {
    const user = this.availableUsers().find((u) => u.id === userId);
    if (user) {
      this.currentUser.set(user);
    }
  }

  private startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      this.timeUpdateTrigger.update((v) => v + 1);
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
