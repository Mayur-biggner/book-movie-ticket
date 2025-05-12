import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
})
export class SuccessComponent {
  constructor(private router: Router) {}

  // This method is called when the user clicks the "Go Home" button
  goHome(): void {
    this.router.navigate(['/']);
  }
}
