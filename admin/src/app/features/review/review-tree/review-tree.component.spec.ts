import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTreeComponent } from './review-tree.component';

describe('ReviewTreeComponent', () => {
  let component: ReviewTreeComponent;
  let fixture: ComponentFixture<ReviewTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
