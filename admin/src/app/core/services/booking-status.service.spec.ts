/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BookingStatusService } from './booking-status.service';

describe('Service: BookingStatus', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookingStatusService]
    });
  });

  it('should ...', inject([BookingStatusService], (service: BookingStatusService) => {
    expect(service).toBeTruthy();
  }));
});
