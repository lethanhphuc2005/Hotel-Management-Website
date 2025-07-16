/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WebsiteContentService } from './website-content.service';

describe('Service: Websitecontent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsiteContentService]
    });
  });

  it('should ...', inject([WebsiteContentService], (service: WebsiteContentService) => {
    expect(service).toBeTruthy();
  }));
});
