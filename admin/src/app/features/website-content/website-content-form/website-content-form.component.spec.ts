import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteContentFormComponent } from './website-content-form.component';

describe('WebsiteContentFormComponent', () => {
  let component: WebsiteContentFormComponent;
  let fixture: ComponentFixture<WebsiteContentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteContentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteContentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
