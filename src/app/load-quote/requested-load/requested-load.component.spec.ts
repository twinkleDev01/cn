import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedLoadComponent } from './requested-load.component';

describe('RequestedLoadComponent', () => {
  let component: RequestedLoadComponent;
  let fixture: ComponentFixture<RequestedLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedLoadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
