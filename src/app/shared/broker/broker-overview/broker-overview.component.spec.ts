import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerOverviewComponent } from './broker-overview.component';

describe('BrokerOverviewComponent', () => {
  let component: BrokerOverviewComponent;
  let fixture: ComponentFixture<BrokerOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
