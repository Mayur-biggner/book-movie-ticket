import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./verify-otp/verify-otp.component').then(
        (m) => m.VerifyOtpComponent
      ),
  },
  {
    path: 'ticket-book',
    loadComponent: () =>
      import('./ticket-book/ticket-book.component').then(
        (m) => m.TicketBookComponent
      ),
  },
  {
    path:'success',
    loadComponent: () =>
      import('./success/success.component').then(
        (m) => m.SuccessComponent
      ),
  },
  // {
  //   path: '**',

  // }
];
