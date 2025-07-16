import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDetailPopupComponent } from './review-detail-popup.component';

describe('ReviewDetailPopupComponent', () => {
  let component: ReviewDetailPopupComponent;
  let fixture: ComponentFixture<ReviewDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewDetailPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
