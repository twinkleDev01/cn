import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckingCompaniesComponent } from './trucking-companies.component';

describe('TruckingCompaniesComponent', () => {
  let component: TruckingCompaniesComponent;
  let fixture: ComponentFixture<TruckingCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckingCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckingCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
