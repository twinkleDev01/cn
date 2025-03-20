import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerReviewsComponent } from './broker-reviews.component';

describe('BrokerReviewsComponent', () => {
  let component: BrokerReviewsComponent;
  let fixture: ComponentFixture<BrokerReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerReviewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
