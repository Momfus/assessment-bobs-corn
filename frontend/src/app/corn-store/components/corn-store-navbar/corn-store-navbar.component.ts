import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CornStoreService } from '@corn-store/services/corn-store.service';

@Component({
  selector: 'app-corn-store-navbar',
  imports: [],
  templateUrl: './corn-store-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CornStoreNavbarComponent {
  private cornService = inject(CornStoreService);

  users = this.cornService.availableUsers;
  currentUser = this.cornService.currentUser;

  selectUser(userId: string) {
    this.cornService.setCurrentUser(userId);
  }

}
