import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStatisticsComponent } from './booking-statistics.component';

describe('BookingStatisticsComponent', () => {
  let component: BookingStatisticsComponent;
  let fixture: ComponentFixture<BookingStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
