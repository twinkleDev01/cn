import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindBrokerDetailsComponent } from './find-broker-details.component';

describe('FindBrokerDetailsComponent', () => {
  let component: FindBrokerDetailsComponent;
  let fixture: ComponentFixture<FindBrokerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindBrokerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindBrokerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
