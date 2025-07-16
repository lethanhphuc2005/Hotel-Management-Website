import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonFilterBarComponent } from './common-filter-bar.component';

describe('CommonFilterBarComponent', () => {
  let component: CommonFilterBarComponent;
  let fixture: ComponentFixture<CommonFilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonFilterBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
