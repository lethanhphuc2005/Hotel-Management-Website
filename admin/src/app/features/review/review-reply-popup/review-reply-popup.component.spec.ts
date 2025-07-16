import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewReplyPopupComponent } from './review-reply-popup.component';

describe('ReviewReplyPopupComponent', () => {
  let component: ReviewReplyPopupComponent;
  let fixture: ComponentFixture<ReviewReplyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewReplyPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewReplyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
