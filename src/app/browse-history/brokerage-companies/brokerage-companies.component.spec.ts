import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageCompaniesComponent } from './brokerage-companies.component';

describe('BrokerageCompaniesComponent', () => {
  let component: BrokerageCompaniesComponent;
  let fixture: ComponentFixture<BrokerageCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerageCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerageCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
