import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStatusFilterComponent } from './booking-status-filter.component';

describe('BookingStatusFilterComponent', () => {
  let component: BookingStatusFilterComponent;
  let fixture: ComponentFixture<BookingStatusFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStatusFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingStatusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
