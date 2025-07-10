/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RoomStatusService } from './room-status.service';

describe('Service: RoomStatus', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomStatusService]
    });
  });

  it('should ...', inject([RoomStatusService], (service: RoomStatusService) => {
    expect(service).toBeTruthy();
  }));
});
