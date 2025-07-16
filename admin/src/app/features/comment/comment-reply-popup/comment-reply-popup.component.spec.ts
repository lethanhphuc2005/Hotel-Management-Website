import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentReplyPopupComponent } from './comment-reply-popup.component';

describe('CommentReplyPopupComponent', () => {
  let component: CommentReplyPopupComponent;
  let fixture: ComponentFixture<CommentReplyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentReplyPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentReplyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
