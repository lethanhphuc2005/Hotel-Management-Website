import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingMethodFormComponent } from './booking-method-form.component';

describe('BookingMethodFormComponent', () => {
  let component: BookingMethodFormComponent;
  let fixture: ComponentFixture<BookingMethodFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingMethodFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingMethodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
