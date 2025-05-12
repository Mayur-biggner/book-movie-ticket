import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-ticket-book',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ticket-book.component.html',
  styleUrl: './ticket-book.component.css',
})
export class TicketBookComponent {
  mobile: string = '';
  rows = 6;
  cols = 6;
  maxSelectableSeats = 2;
  seats: { selected: boolean; occupied: boolean }[] = [];
  selectedSeatNumbers: number[] = [];
  bookingForm: FormGroup;

 constructor(private fb: FormBuilder, private router: Router) {
  this.rows = 6;
  this.cols = 6;

  const totalSeats = this.rows * this.cols;

  this.seats = Array.from({ length: totalSeats }, (_, i) => {
    if (i < this.cols) {
      // First row (VIP)
      return {
        selected: false,
        occupied: true,
        vip:true
      };
    } else {
      // Other seats: 10% chance of being randomly occupied
      return {
        selected: false,
        occupied: Math.random() < 0.1,
        vip:false
      };
    }
  });

  this.bookingForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  this.mobile = this.router.getCurrentNavigation()?.extras.state?.['mobile'];
  console.log('Mobile:', this.mobile); // For debugging
  if (!this.mobile && this.mobile !== '') {
    this.router.navigate(['/login']);
  }
}


  get seatRows(): any[][] {
    const rows = [];
    for (let i = 0; i < this.seats.length; i += 6) {
      rows.push(this.seats.slice(i, i + 6));
    }
    return rows;
  }

  toggleSeat(index: number): void {
    const seat = this.seats[index];

    if (seat.occupied) return;

    const selectedCount = this.seats.filter((s) => s.selected).length;

    if (!seat.selected && selectedCount >= this.maxSelectableSeats) {
      alert(
        `You can only select a maximum of ${this.maxSelectableSeats} seats.`
      );
      return;
    }

    seat.selected = !seat.selected;
  }

  confirmSelection(): void {
    const selectedSeats = this.seats
      .map((seat, i) => (seat.selected ? i + 1 : null))
      .filter((val) => val !== null);

    if (selectedSeats.length === 0) {
      alert('Please select at least 1 seat.');
      return;
    }

    alert(`You selected seat(s): ${selectedSeats.join(', ')}`);
  }

  openBookingModal(): void {
    this.selectedSeatNumbers = this.seats
      .map((seat, index) => (seat.selected ? index + 1 : null))
      .filter((num) => num !== null) as number[];

    if (this.selectedSeatNumbers.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    const modalElement = document.getElementById('bookingModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  submitBooking(): void {
    if (this.bookingForm.invalid) return;

    const { fullName, email } = this.bookingForm.value;

    console.log('Booking Details:', {
      fullName,
      email,
      seats: this.selectedSeatNumbers,
    });

    alert(
      `Booking confirmed for ${fullName} Email: ${email} - Seats: ${this.selectedSeatNumbers.join(
        ', '
      )}`
    );

    this.seats.forEach((seat) => {
      if (seat.selected) seat.occupied = true;
      seat.selected = false;
    });

    this.bookingForm.reset();

    const modalElement = document.getElementById('bookingModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.router.navigate(['/success']);
  }
}
