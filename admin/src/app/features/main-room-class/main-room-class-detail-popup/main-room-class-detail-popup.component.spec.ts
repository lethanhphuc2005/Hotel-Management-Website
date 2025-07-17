import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRoomClassDetailPopupComponent } from './main-room-class-detail-popup.component';

describe('MainRoomClassDetailPopupComponent', () => {
  let component: MainRoomClassDetailPopupComponent;
  let fixture: ComponentFixture<MainRoomClassDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainRoomClassDetailPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainRoomClassDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
