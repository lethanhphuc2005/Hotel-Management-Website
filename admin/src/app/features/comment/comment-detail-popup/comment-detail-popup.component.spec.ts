import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentDetailPopupComponent } from './comment-detail-popup.component';

describe('CommentDetailPopupComponent', () => {
  let component: CommentDetailPopupComponent;
  let fixture: ComponentFixture<CommentDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentDetailPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
