import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { DatePipe } from '@angular/common';
import { CoreRoutingModule } from './core.routing';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SignInComponent } from './sign-in/sign-in.component';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';
import { CarrierSignUpComponent } from './carrier-sign-up/carrier-sign-up.component';
import { UserTypeComponent } from './user-type/user-type.component';
import { UnregisteredComponent } from './unregistered/unregistered.component';
import { CarrierProfileClaim } from './carrier-profile-claim/carrier-profile-claim.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { BrokerProfileClaim } from './broker-profile-claim/broker-profile-claim.component';
import { BrokerSignUpComponent } from './broker-sign-up/broker-sign-up.component';

@NgModule({

  imports: [
    CoreRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule,
  ],

  declarations: [
    SignInComponent,
    UserSignUpComponent,
    CarrierSignUpComponent,
    UserTypeComponent,
    UnregisteredComponent,
    CarrierProfileClaim,
    VerifyOtpComponent,
    ForgotPasswordComponent,
    BrokerProfileClaim,
    BrokerSignUpComponent
  ],
  exports: [
    SignInComponent,
    UserSignUpComponent,
    CarrierSignUpComponent,
    UserTypeComponent,
    UnregisteredComponent,
    CarrierProfileClaim,
    VerifyOtpComponent,
    ForgotPasswordComponent,
    BrokerProfileClaim,
    BrokerSignUpComponent
  ],
  providers: [DatePipe],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],

})
export class CoreModule { }
