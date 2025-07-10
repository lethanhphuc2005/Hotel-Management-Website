/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RoomClassService } from './room-class.service';

describe('Service: RoomClass', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomClassService]
    });
  });

  it('should ...', inject([RoomClassService], (service: RoomClassService) => {
    expect(service).toBeTruthy();
  }));
});
