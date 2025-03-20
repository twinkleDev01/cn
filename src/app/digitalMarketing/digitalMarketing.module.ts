import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from "@angular/core";
import { digitalMarketingRoutingModule } from "./digitalMarketing-routing.module";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { NgxLoadingModule } from "ngx-loading";
import { DigitalMarkingSocialMediaComponenet } from "src/app/shared/digital-marking-social-media/digital-marking-social-media.component";
import { GoogleAnalyticsCodeComponenet } from "./carrier-Component/google-analytics-code/google-analytics-code.component";
import { SocialMediaComponenet } from "./carrier-Component/social-media/social-media.componenet";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SEOComponent } from "./carrier-Component/seo/seo.component";

@NgModule({
    declarations: [
      SEOComponent,
      DigitalMarkingSocialMediaComponenet,
      GoogleAnalyticsCodeComponenet,
      SocialMediaComponenet
      
    ],
    imports: [
      digitalMarketingRoutingModule,
      CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule,
    SharedModule
    ],
    schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
})
  export class DigitalMarketingModule{ }