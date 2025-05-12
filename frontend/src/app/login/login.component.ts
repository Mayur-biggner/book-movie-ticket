import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
    });
  }

  get countryCode() {
    return this.loginForm.get('countryCode');
  }

  get mobileNumber() {
    return this.loginForm.get('mobileNumber');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const mobile = `${this.loginForm.value.mobileNumber}`;
      // For demo, we'll just navigate
      this.router.navigate(['/verify-otp'], { state: { mobile } });
    }
  }
}
