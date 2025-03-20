import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanesRegionsComponent } from './lanes-regions.component';

describe('LanesRegionsComponent', () => {
  let component: LanesRegionsComponent;
  let fixture: ComponentFixture<LanesRegionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanesRegionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanesRegionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
