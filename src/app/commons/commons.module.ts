import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { CommonsRoutingModule } from './commons-routing.module';
import { AuthGuard } from './guard/auth.guard';
import { BeforeAuthGuard } from './guard/before-auth.guard';
import { PhoneNumberPipe } from './pipe/phone-number.pipe';
// import { UserProfileComponent } from './user-profile/user-profile.component';
// import { OverviewComponent } from './overview/overview.component';
// import { ContactInformationComponent } from './contact-information/contact-information.component';
// import { BusinessInformationComponent } from './business-information/business-information.component';
// import { LoadAvailabilityComponent } from './load-availability/load-availability.component';
// import { InsuranceComponent } from './insurance/insurance.component';
// import { LanesRegionsComponent } from './lanes-regions/lanes-regions.component';
// import { MediaGalleryComponent } from './media-gallery/media-gallery.component';
// import { SafetyComponent } from './safety/safety.component';
// import { ReviewsComponent } from './reviews/reviews.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommonsRoutingModule,
    MaterialModule,
    ReviewsModule,
  ],

  providers: [AuthGuard, BeforeAuthGuard, DatePipe],

  declarations: [
    PhoneNumberPipe,
    // UserProfileComponent,
    // OverviewComponent,
    // ContactInformationComponent,
    // BusinessInformationComponent,
    // LoadAvailabilityComponent,
    // InsuranceComponent,
    // LanesRegionsComponent,
    // MediaGalleryComponent,
    // SafetyComponent,
    // ReviewsComponent
  ],
  
  entryComponents: [],
})
export class CommonsModule {}
