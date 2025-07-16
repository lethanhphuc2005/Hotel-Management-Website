import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingMethodListComponent } from './booking-method-list.component';

describe('BookingMethodListComponent', () => {
  let component: BookingMethodListComponent;
  let fixture: ComponentFixture<BookingMethodListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingMethodListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingMethodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
