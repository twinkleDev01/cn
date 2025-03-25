import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierDashboardComponent } from './carrier-dashboard.component';

describe('CarrierDashboardComponent', () => {
  let component: CarrierDashboardComponent;
  let fixture: ComponentFixture<CarrierDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrierDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
