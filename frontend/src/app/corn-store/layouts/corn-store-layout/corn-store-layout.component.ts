import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CornStoreNavbarComponent } from "../../components/corn-store-navbar/corn-store-navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-corn-store-layout',
  imports: [RouterOutlet, CornStoreNavbarComponent],
  templateUrl: './corn-store-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CornStoreLayoutComponent { }
