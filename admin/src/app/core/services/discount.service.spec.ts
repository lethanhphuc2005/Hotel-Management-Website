/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DiscountService } from './discount.service';

describe('Service: Discount', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiscountService]
    });
  });

  it('should ...', inject([DiscountService], (service: DiscountService) => {
    expect(service).toBeTruthy();
  }));
});
