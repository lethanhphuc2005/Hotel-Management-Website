/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContentTypeService } from './content-type.service';

describe('Service: ContentType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentTypeService]
    });
  });

  it('should ...', inject([ContentTypeService], (service: ContentTypeService) => {
    expect(service).toBeTruthy();
  }));
});
