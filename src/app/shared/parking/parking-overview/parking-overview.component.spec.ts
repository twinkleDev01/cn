import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingOverviewComponent } from './parking-overview.component';

describe('ParkingOverviewComponent', () => {
  let component: ParkingOverviewComponent;
  let fixture: ComponentFixture<ParkingOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
