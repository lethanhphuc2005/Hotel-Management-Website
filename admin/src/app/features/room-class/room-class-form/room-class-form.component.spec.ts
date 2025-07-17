import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomClassFormComponent } from './room-class-form.component';

describe('RoomClassFormComponent', () => {
  let component: RoomClassFormComponent;
  let fixture: ComponentFixture<RoomClassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomClassFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomClassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
