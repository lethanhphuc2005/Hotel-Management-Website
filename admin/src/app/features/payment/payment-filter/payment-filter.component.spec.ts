import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFilterComponent } from './payment-filter.component';

describe('PaymentFilterComponent', () => {
  let component: PaymentFilterComponent;
  let fixture: ComponentFixture<PaymentFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
