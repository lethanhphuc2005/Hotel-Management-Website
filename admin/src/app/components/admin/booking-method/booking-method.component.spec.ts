/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BookingMethodComponent } from './booking-method.component';

describe('BookingMethodComponent', () => {
  let component: BookingMethodComponent;
  let fixture: ComponentFixture<BookingMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
