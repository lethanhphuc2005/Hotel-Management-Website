import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomClassListComponent } from './room-class-list.component';

describe('RoomClassListComponent', () => {
  let component: RoomClassListComponent;
  let fixture: ComponentFixture<RoomClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomClassListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
