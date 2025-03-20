import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCarrierDetailsComponent } from './find-carrier-details.component';

describe('FindCarrierDetailsComponent', () => {
  let component: FindCarrierDetailsComponent;
  let fixture: ComponentFixture<FindCarrierDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindCarrierDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindCarrierDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
