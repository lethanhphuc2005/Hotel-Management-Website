import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRoomClassFormComponent } from './main-room-class-form.component';

describe('MainRoomClassFormComponent', () => {
  let component: MainRoomClassFormComponent;
  let fixture: ComponentFixture<MainRoomClassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainRoomClassFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainRoomClassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
