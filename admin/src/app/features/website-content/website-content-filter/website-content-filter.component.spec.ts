import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteContentFilterComponent } from './website-content-filter.component';

describe('WebsiteContentFilterComponent', () => {
  let component: WebsiteContentFilterComponent;
  let fixture: ComponentFixture<WebsiteContentFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteContentFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteContentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
