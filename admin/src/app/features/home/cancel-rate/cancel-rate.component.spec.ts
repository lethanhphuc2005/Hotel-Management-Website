import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRateComponent } from './cancel-rate.component';

describe('CancelRateComponent', () => {
  let component: CancelRateComponent;
  let fixture: ComponentFixture<CancelRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
