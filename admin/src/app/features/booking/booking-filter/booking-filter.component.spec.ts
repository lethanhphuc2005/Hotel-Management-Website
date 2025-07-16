import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFilterComponent } from './booking-filter.component';

describe('BookingFilterComponent', () => {
  let component: BookingFilterComponent;
  let fixture: ComponentFixture<BookingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
