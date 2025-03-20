import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCarriersComponent } from './find-carriers.component';

describe('FindCarriersComponent', () => {
  let component: FindCarriersComponent;
  let fixture: ComponentFixture<FindCarriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindCarriersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindCarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
