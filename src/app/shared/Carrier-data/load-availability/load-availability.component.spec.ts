import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadAvailabilityComponent } from './load-availability.component';

describe('LoadAvailabilityComponent', () => {
  let component: LoadAvailabilityComponent;
  let fixture: ComponentFixture<LoadAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadAvailabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
