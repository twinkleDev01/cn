import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerAuthorityComponent } from './broker-authority.component';

describe('BrokerAuthorityComponent', () => {
  let component: BrokerAuthorityComponent;
  let fixture: ComponentFixture<BrokerAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerAuthorityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
