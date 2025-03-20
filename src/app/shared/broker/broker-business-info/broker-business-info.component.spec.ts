import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerBusinessInfoComponent } from './broker-business-info.component';

describe('BrokerBusinessInfoComponent', () => {
  let component: BrokerBusinessInfoComponent;
  let fixture: ComponentFixture<BrokerBusinessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerBusinessInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerBusinessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
