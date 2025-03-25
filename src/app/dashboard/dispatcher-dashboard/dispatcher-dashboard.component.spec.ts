import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatcherDashboardComponent } from './dispatcher-dashboard.component';

describe('DispatcherDashboardComponent', () => {
  let component: DispatcherDashboardComponent;
  let fixture: ComponentFixture<DispatcherDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatcherDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatcherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
