import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedLoadComponent } from './received-load.component';

describe('ReceivedLoadComponent', () => {
  let component: ReceivedLoadComponent;
  let fixture: ComponentFixture<ReceivedLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivedLoadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
