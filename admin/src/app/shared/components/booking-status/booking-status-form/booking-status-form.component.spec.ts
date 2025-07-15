import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStatusFormComponent } from './booking-status-form.component';

describe('BookingStatusFormComponent', () => {
  let component: BookingStatusFormComponent;
  let fixture: ComponentFixture<BookingStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStatusFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
