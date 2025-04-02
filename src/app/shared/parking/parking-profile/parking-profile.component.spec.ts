import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingProfileComponent } from './parking-profile.component';

describe('ParkingProfileComponent', () => {
  let component: ParkingProfileComponent;
  let fixture: ComponentFixture<ParkingProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
