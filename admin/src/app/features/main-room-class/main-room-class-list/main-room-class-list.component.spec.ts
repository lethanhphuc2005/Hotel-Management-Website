import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRoomClassListComponent } from './main-room-class-list.component';

describe('MainRoomClassListComponent', () => {
  let component: MainRoomClassListComponent;
  let fixture: ComponentFixture<MainRoomClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainRoomClassListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainRoomClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
