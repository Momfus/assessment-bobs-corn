import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CornStoreService } from '../../services/corn-store.service';

@Component({
  selector: 'app-corn-store-dashboard',
  templateUrl: './corn-store-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class CornStoreDashboardComponent implements OnInit {
  private cornStoreService = inject(CornStoreService);

  errorMessage = this.cornStoreService.errorMessage;
  isLoading = this.cornStoreService.isLoading;
  purchaseCount = this.cornStoreService.purchaseCount;
  secondsToWait = this.cornStoreService.secondsToWait;
  timeSinceLastPurchase = this.cornStoreService.timeSinceLastPurchase;

  ngOnInit() {
    this.cornStoreService.loadPurchaseInfo();
  }

  onBuyCorn() {
    this.cornStoreService.buyCorn();
  }
}
