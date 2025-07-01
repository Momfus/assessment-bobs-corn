import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [],
  template: `
    <div
      class="flex flex-col items-center justify-center min-h-screen  text-center"
    >
      <h1 class="text-4xl font-bold text-white mb-4">
        404 - Page Not Found
      </h1>
      <p class="text-lg text-gray-200 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <button
        class="px-6 py-3 btn btn-warning btn-outline text-gray-white rounded-lg shadow-md cursor-pointer"
        (click)="goHome()"
      >
        Go to Home
      </button>
    </div>
  `,
})
export class NotFoundPageComponent {
  router = inject(Router);
  goHome() {
    this.router.navigate(['/']);
  }
}
