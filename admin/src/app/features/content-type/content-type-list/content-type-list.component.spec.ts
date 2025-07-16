import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypeListComponent } from './content-type-list.component';

describe('ContentTypeListComponent', () => {
  let component: ContentTypeListComponent;
  let fixture: ComponentFixture<ContentTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentTypeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
