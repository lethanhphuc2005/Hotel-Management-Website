/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RoomtypeService } from './roomtype.service';

describe('Service: Roomtype', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomtypeService]
    });
  });

  it('should ...', inject([RoomtypeService], (service: RoomtypeService) => {
    expect(service).toBeTruthy();
  }));
});
