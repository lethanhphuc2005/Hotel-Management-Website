import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomClassDetailComponent } from './room-class-detail.component';

describe('RoomClassDetailComponent', () => {
  let component: RoomClassDetailComponent;
  let fixture: ComponentFixture<RoomClassDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomClassDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomClassDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
