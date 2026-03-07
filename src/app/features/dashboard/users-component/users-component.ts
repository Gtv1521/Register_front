import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-users-component',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './users-component.html',
  styleUrl: './users-component.scss',
})
export class UsersComponent {
  private router = inject(Router)


  onBack(){
    this.router.navigate(['dashboard'])
  }

}
