import { Component, inject, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {

  private readonly route = inject(Router);

  goLogin() {
    this.route.navigate(["/login"]);
  }
}
