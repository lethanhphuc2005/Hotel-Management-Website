/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RoomtypeMainComponent } from './roomtype-main.component';

describe('RoomtypeMainComponent', () => {
  let component: RoomtypeMainComponent;
  let fixture: ComponentFixture<RoomtypeMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomtypeMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomtypeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
