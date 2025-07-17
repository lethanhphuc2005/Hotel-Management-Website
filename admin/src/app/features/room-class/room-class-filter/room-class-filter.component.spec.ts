import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomClassFilterComponent } from './room-class-filter.component';

describe('RoomClassFilterComponent', () => {
  let component: RoomClassFilterComponent;
  let fixture: ComponentFixture<RoomClassFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomClassFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomClassFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
