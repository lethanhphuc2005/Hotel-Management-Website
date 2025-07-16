import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypeFormComponent } from './content-type-form.component';

describe('ContentTypeFormComponent', () => {
  let component: ContentTypeFormComponent;
  let fixture: ComponentFixture<ContentTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentTypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
