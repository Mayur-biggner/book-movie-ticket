import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { VerifyOtpService } from './verify-otp.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css',
})
export class VerifyOtpComponent implements OnInit {
  mobile: string = '';
  toastMessage: string = '';
  toastClass: string = '';
  otpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _otpService: VerifyOtpService
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });
    this.mobile = this.router.getCurrentNavigation()?.extras.state?.['mobile'];
    console.log('Mobile:', this.mobile); // For debugging
    if (!this.mobile && this.mobile != '') {
      this.router.navigate(['/login']);
    }
  }
  ngOnInit(): void {}

  get otp() {
    return this.otpForm.get('otp');
  }

  async onSubmit() {
    if (this.otpForm.valid) {
      const otpValue = this.otpForm.value.otp;
      await this._otpService.verifyOtp(this.mobile, otpValue).subscribe({
        next: (response) => {
          console.log('OTP Verification Response:', response.error);
          // Handle success or failure based on the response
          this.toastMessage = response.message && response.message;
          this.toastClass = response.message ? 'bg-success' : 'bg-danger';
          const toastElement = document.getElementById('otpToast');
          if (toastElement && bootstrap.Toast) {
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
          }
          this.router.navigate(['/ticket-book'], {
            state: { mobile: this.mobile },
          });
        },
        error: (error) => {
          this.toastMessage = error.error.errors;
          this.toastClass = 'bg-danger';
          const toastElement = document.getElementById('otpToast');
          if (toastElement && bootstrap.Toast) {
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
          }
          if (error.status == 429) {
            //to-do show back button
            this.router.navigate(['/login']);
          }
        },
      });
      // Reset form after submission (optional)
      this.otpForm.reset();
    }
  }
}
