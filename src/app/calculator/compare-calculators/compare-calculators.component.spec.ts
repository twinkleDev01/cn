import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareCalculatorsComponent } from './compare-calculators.component';

describe('CompareCalculatorsComponent', () => {
  let component: CompareCalculatorsComponent;
  let fixture: ComponentFixture<CompareCalculatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareCalculatorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareCalculatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
