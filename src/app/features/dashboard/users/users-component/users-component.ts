import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-users-component',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatIcon],
  templateUrl: './users-component.html',
  styleUrl: './users-component.scss',
})
export class UsersComponent {
  private router = inject(Router)


  onBack(){
    this.router.navigate(['dashboard'])
  }

}
