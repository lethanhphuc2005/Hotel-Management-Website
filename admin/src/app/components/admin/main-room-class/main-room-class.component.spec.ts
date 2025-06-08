/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MainRoomClassComponent } from './main-room-class.component';

describe('MainRoomClassComponent', () => {
  let component: MainRoomClassComponent;
  let fixture: ComponentFixture<MainRoomClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainRoomClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRoomClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
