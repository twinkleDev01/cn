import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCpmonthComponent } from './manage-cpmonth.component';

describe('ManageCpmonthComponent', () => {
  let component: ManageCpmonthComponent;
  let fixture: ComponentFixture<ManageCpmonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCpmonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCpmonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
