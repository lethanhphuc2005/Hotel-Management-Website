/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WebsitecontentService } from './websitecontent.service';

describe('Service: Websitecontent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsitecontentService]
    });
  });

  it('should ...', inject([WebsitecontentService], (service: WebsitecontentService) => {
    expect(service).toBeTruthy();
  }));
});
