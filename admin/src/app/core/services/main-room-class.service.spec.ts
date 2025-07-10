/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MainRoomClassService } from './main-room-class.service';

describe('Service: MainRoomClass', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainRoomClassService]
    });
  });

  it('should ...', inject([MainRoomClassService], (service: MainRoomClassService) => {
    expect(service).toBeTruthy();
  }));
});
