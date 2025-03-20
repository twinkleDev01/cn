import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorMonthComponent } from './calculator-month.component';

describe('CalculatorMonthComponent', () => {
  let component: CalculatorMonthComponent;
  let fixture: ComponentFixture<CalculatorMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
