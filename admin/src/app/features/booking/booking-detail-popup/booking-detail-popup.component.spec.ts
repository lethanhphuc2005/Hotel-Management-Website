import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailPopupComponent } from './booking-detail-popup.component';

describe('BookingDetailPopupComponent', () => {
  let component: BookingDetailPopupComponent;
  let fixture: ComponentFixture<BookingDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
