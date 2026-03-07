import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-access-component',
  imports: [],
  templateUrl: './no-access-component.html',
  styleUrl: './no-access-component.scss',
})
export class NoAccessComponent {
  private router = inject(Router);

  onBack() {
    this.router.navigate(['dashboard'])
  }
}
