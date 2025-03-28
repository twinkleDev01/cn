import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckOnDemandComponent } from './truck-on-demand.component';

describe('TruckOnDemandComponent', () => {
  let component: TruckOnDemandComponent;
  let fixture: ComponentFixture<TruckOnDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckOnDemandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckOnDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
