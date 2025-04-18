import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from '../material.module';

// Popup Components
import { AddCardPopupComponent } from './add-card-popup/add-card-popup.component';
import { CardListComponent } from './card-list/card-list.component';
import { CommonPopupComponent } from './common-popup/common-popup.component';
import { DotNumberPopupComponent } from './dot-number-popup/dot-number-popup.component';
import { DragNDropComponent } from './drag-n-drop/drag-n-drop.component';
import { PopupComponent } from './popup/popup.component';
import { ReviewPopupComponent } from './review-popup/review-popup.component';
import { ReviewShowComponent } from './review-show/review-show.component';
import { SubscriptionPopupComponent } from './subscription-popup/subscription-popup.component';

// Carrier Data Components
import { UserProfileComponent } from './Carrier-data/user-profile/user-profile.component';
import { OverviewComponent } from './Carrier-data/overview/overview.component';
import { BusinessInformationComponent } from './Carrier-data/business-information/business-information.component';
import { LoadAvailabilityComponent } from './Carrier-data/load-availability/load-availability.component';
import { InsuranceComponent } from './Carrier-data/insurance/insurance.component';
import { LanesRegionsComponent } from './Carrier-data/lanes-regions/lanes-regions.component';
import { MediaGalleryComponent } from './Carrier-data/media-gallery/media-gallery.component';
import { ContactInformationComponent } from './Carrier-data/contact-information/contact-information.component';
import { SafetyComponent } from './Carrier-data/safety/safety.component';
import { ReviewsComponent } from './Carrier-data/reviews/reviews.component';

// Broker data components 
import { ComplianceComponent } from './broker/compliance/compliance.component';
import { BrokerOverviewComponent } from './broker/broker-overview/broker-overview.component';
import { BrokerBusinessInfoComponent } from './broker/broker-business-info/broker-business-info.component';
import { BrokerInsuranceComponent } from './broker/broker-insurance/broker-insurance.component';
import { BrokerLanesRegionsComponent } from './broker/broker-lanes-regions/broker-lanes-regions.component';
import { BrokerReviewsComponent } from './broker/broker-reviews/broker-reviews.component';
import { TimeAgoPipe } from '../commons/pipe/time-ago.pipe';
// parking data components 
import { ParkingAmenitiesComponent } from './parking/parking-amenities/parking-amenities.component';
import { ParkingLocationComponent } from './parking/parking-location/parking-location.component';
import { ParkingMediaGalleryComponent } from './parking/parking-media-gallery/parking-media-gallery.component';
import { ParkingOverviewComponent } from './parking/parking-overview/parking-overview.component';
import { ParkingProfileComponent } from './parking/parking-profile/parking-profile.component';
import { InfiniteScrollDirective } from './infinite-scroll.directive';
import { CustomDateTimePipe } from '../commons/pipe/customDateTime.pipe';
import { FrequencyDateTimePipe } from '../commons/pipe/frequency-date-time.pipe';

// parking data component 



@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule,
    ImageCropperModule
  ],
  declarations: [
    // Popup Components
    PopupComponent,
    AddCardPopupComponent,
    CardListComponent,
    CommonPopupComponent,
    DotNumberPopupComponent,
    DragNDropComponent,
    ReviewPopupComponent,
    ReviewShowComponent,
    SubscriptionPopupComponent,

    // Carrier Data Components
    UserProfileComponent,
    BusinessInformationComponent,
    LoadAvailabilityComponent,
    InsuranceComponent,
    LanesRegionsComponent,
    MediaGalleryComponent,
    ContactInformationComponent,
    SafetyComponent,
    ReviewsComponent,
    OverviewComponent,

  // Broker data Components 
    ComplianceComponent,
      BrokerOverviewComponent,
      BrokerBusinessInfoComponent,
      BrokerInsuranceComponent,
      BrokerLanesRegionsComponent,
      BrokerReviewsComponent,
      // Pipe
      TimeAgoPipe,
      CustomDateTimePipe,
      FrequencyDateTimePipe,
// directive
InfiniteScrollDirective,
      // parking data componets 
      ParkingAmenitiesComponent,
      ParkingLocationComponent,
      ParkingMediaGalleryComponent,
      ParkingOverviewComponent,
      ParkingProfileComponent,
  ],
  exports: [
    // Popup Components
    PopupComponent,
    AddCardPopupComponent,
    CardListComponent,
    CommonPopupComponent,
    DotNumberPopupComponent,
    DragNDropComponent,
    ReviewPopupComponent,
    ReviewShowComponent,
    SubscriptionPopupComponent,

    // Carrier Data Components
    UserProfileComponent,
    BusinessInformationComponent,
    LoadAvailabilityComponent,
    InsuranceComponent,
    LanesRegionsComponent,
    MediaGalleryComponent,
    ContactInformationComponent,
    SafetyComponent,
    ReviewsComponent,
    OverviewComponent,

  // Broker data Components 
    ComplianceComponent,
      BrokerOverviewComponent,
      BrokerBusinessInfoComponent,
      BrokerInsuranceComponent,
      BrokerLanesRegionsComponent,
      BrokerReviewsComponent,
  //  Pipe
  TimeAgoPipe,
  CustomDateTimePipe,
  FrequencyDateTimePipe,
// directive
InfiniteScrollDirective,
      // parking data componets 
      ParkingAmenitiesComponent,
      ParkingLocationComponent,
      ParkingMediaGalleryComponent,
      ParkingOverviewComponent,
      ParkingProfileComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
