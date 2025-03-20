import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrierProfileClaim } from './carrier-profile-claim/carrier-profile-claim.component';
import { CarrierSignUpComponent } from './carrier-sign-up/carrier-sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { UnregisteredComponent } from './unregistered/unregistered.component';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';
import { UserTypeComponent } from './user-type/user-type.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { BrokerProfileClaim } from './broker-profile-claim/broker-profile-claim.component';
import { BrokerSignUpComponent } from './broker-sign-up/broker-sign-up.component';

const routes: Routes = [
   {
    path: '',
    component: SignInComponent,
  },
  {
    path: 'sign-in',
    component: SignInComponent,

  },
  {
    path: 'unregistered',
    component: UnregisteredComponent,
  },
  {
    path: 'user-sign-up',
    component: CarrierSignUpComponent,
    pathMatch: 'full',
  },
  {
    path: 'carrier-sign-up',
    component: CarrierSignUpComponent,
    pathMatch: 'full',
  },
  {
    path: 'broker-sign-up',
    component: BrokerSignUpComponent,
    pathMatch: 'full',
  },
  // {
  //   path: 'broker-sign-up',
  //   component: UserSignUpComponent,
  //   pathMatch: 'full',
  // },
  {
    path: 'shipper-sign-up',
    component: UserSignUpComponent,
    pathMatch: 'full',
  },
  {
    path: 'dispatcher-sign-up',
    component: UserSignUpComponent,
    pathMatch: 'full',
  },
  {
    path: 'seller-sign-up',
    component: UserSignUpComponent,
    pathMatch: 'full',
  },
  {
    path: 'carrier-profile-claim',
    component: CarrierProfileClaim,
    pathMatch: 'full',
  },
  {
    path: 'broker-profile-claim',
    component: BrokerProfileClaim,
    pathMatch: 'full',
  },
  // {
  //   path: 'carrier-profile-claim-free',
  //   component: CarrierProfileClaim,
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'carrier-profile-claim-premium',
  //   component: CarrierProfileClaim,
  //   pathMatch: 'full',
  // },
  {
    path: 'sign-up-user-type',
    component: UserTypeComponent,
    pathMatch: 'full',
  },
  // {
  //   path: 'sign-up-user-type-free',
  //   component: UserTypeComponent,
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'sign-up-user-type-premium',
  //   component: UserTypeComponent,
  //   pathMatch: 'full',
  // },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    pathMatch: 'full',
  },  
  {
    path: 'verify-otp',
    component: VerifyOtpComponent,
    pathMatch: 'full',
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule { }
