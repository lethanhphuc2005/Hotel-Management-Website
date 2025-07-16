import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteContentListComponent } from './website-content-list.component';

describe('WebsiteContentListComponent', () => {
  let component: WebsiteContentListComponent;
  let fixture: ComponentFixture<WebsiteContentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteContentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
