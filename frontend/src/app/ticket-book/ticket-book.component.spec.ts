import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketBookComponent } from './ticket-book.component';

describe('TicketBookComponent', () => {
  let component: TicketBookComponent;
  let fixture: ComponentFixture<TicketBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketBookComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
