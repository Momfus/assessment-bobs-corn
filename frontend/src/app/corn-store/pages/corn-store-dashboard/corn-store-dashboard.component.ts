import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CornStoreService } from '../../services/corn-store.service';

@Component({
  selector: 'app-corn-store-dashboard',
  templateUrl: './corn-store-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class CornStoreDashboardComponent {
  cornService = inject(CornStoreService);

  errorMessage = this.cornService.errorMessage;
  isLoading = this.cornService.isLoading;
  purchaseCount = this.cornService.purchaseCount;
  secondsToWait = this.cornService.secondsToWait;
  timeSinceLastPurchase = this.cornService.timeSinceLastPurchase;

  onBuyCorn() {
    this.cornService.buyCorn();
  }
}
