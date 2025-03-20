import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerInsuranceComponent } from './broker-insurance.component';

describe('BrokerInsuranceComponent', () => {
  let component: BrokerInsuranceComponent;
  let fixture: ComponentFixture<BrokerInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerInsuranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
