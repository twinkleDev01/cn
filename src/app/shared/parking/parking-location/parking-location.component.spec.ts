import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingLocationComponent } from './parking-location.component';

describe('ParkingLocationComponent', () => {
  let component: ParkingLocationComponent;
  let fixture: ComponentFixture<ParkingLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
