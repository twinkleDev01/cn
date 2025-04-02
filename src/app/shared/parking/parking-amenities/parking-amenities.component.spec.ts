import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingAmenitiesComponent } from './parking-amenities.component';

describe('ParkingAmenitiesComponent', () => {
  let component: ParkingAmenitiesComponent;
  let fixture: ComponentFixture<ParkingAmenitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingAmenitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
