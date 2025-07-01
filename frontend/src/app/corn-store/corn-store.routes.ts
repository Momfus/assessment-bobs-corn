import { Routes } from "@angular/router";
import { CornStoreLayoutComponent } from "./layouts/corn-store-layout/corn-store-layout.component";
import { CornStoreDashboardComponent } from "./pages/corn-store-dashboard/corn-store-dashboard.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";


export const storeFrontRoutes: Routes = [

  {
    path: '',
    component: CornStoreLayoutComponent,
    children: [
      {
        path: '',
        component: CornStoreDashboardComponent
      },
      {
        path: '**',
        component: NotFoundPageComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]

export default storeFrontRoutes;
