/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BookingMethodService } from './booking-method.service';

describe('Service: BookingMethod', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookingMethodService]
    });
  });

  it('should ...', inject([BookingMethodService], (service: BookingMethodService) => {
    expect(service).toBeTruthy();
  }));
});
