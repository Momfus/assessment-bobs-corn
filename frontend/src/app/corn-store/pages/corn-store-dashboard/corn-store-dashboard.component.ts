import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CornStoreService } from '../../services/corn-store.service';

@Component({
  selector: 'app-corn-store-dashboard',
  templateUrl: './corn-store-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class CornStoreDashboardComponent {
  cornService = inject(CornStoreService);

  errorMessage = this.cornService.errorMessage;
  isLoading = this.cornService.isLoading;
  purchaseCount = this.cornService.purchaseCount;
  secondsToWait = this.cornService.secondsToWait;
  timeSinceLastPurchase = this.cornService.timeSinceLastPurchase;
  canBuy = this.cornService.canBuy;

  onBuyCorn() {
    this.cornService.buyCorn();
  }
}
