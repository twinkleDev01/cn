import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingMediaGalleryComponent } from './parking-media-gallery.component';

describe('ParkingMediaGalleryComponent', () => {
  let component: ParkingMediaGalleryComponent;
  let fixture: ComponentFixture<ParkingMediaGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingMediaGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingMediaGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
