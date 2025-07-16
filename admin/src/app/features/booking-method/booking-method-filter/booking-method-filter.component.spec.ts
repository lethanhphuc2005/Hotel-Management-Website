import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingMethodFilterComponent } from './booking-method-filter.component';

describe('BookingMethodFilterComponent', () => {
  let component: BookingMethodFilterComponent;
  let fixture: ComponentFixture<BookingMethodFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingMethodFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingMethodFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
