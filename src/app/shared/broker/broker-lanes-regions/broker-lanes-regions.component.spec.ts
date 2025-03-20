import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerLanesRegionsComponent } from './broker-lanes-regions.component';

describe('BrokerLanesRegionsComponent', () => {
  let component: BrokerLanesRegionsComponent;
  let fixture: ComponentFixture<BrokerLanesRegionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerLanesRegionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerLanesRegionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
