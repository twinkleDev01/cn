    // oct 2024 commented this condition because when we refrash the app it redirect to overview 

import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonService } from './commons/service/common.service';
import { ScriptService } from './commons/service/script.service';
import { SharedService } from './commons/service/shared.service';
import { AppSettings } from './commons/setting/app_setting';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'carriers-network-angular';
  public isLoggedIn = false;
  countryListData: any;
  public skeletonLoader = false;
  public path :any

  constructor(
    private scriptService: ScriptService,
    private sharedService: SharedService,
    private commonService: CommonService,
    private router: Router,
    
  ) { }

isSidebarVisible: boolean = true;
  isToggleVisible: boolean = false;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  showToggleButton() {
    this.isToggleVisible = true;
  }

  hideToggleButton() {
    this.isToggleVisible = false;
  }



ngOnInit() {
  if(environment.production && window.location.origin == environment.domain){    
    // this.sharedService.loadGAScript();
    this.sharedService.loadGTMScript();
    this.sharedService.loadGTMNoScript();
    this.sharedService.loadHotjarScript();
  }
  this.getConfig();
  if(localStorage.getItem("access_token")){
    this.getUserProfile();
  }
  this.scriptService.load().then(() => { });
  this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      this.handleNavigation(event);
    }
  });

  this.sharedService.updateTokenData.subscribe(() => {
    this.userCheckLogin();
  });

  this.userCheckLogin();
}

handleNavigation(event: NavigationEnd) {
  const publicRoutes = ['/', '/sign-in', '/sign-up-user-type-free', '/sign-up-user-type-premium', '/write-review', '/forgot-password', '/verify-otp', '/carrier-sign-up', '/user-sign-up', '/unregistered', '/sign-up-user-type','/broker-profile-claim', '/carrier-profile-claim', '/carrier-profile-claim-premium', '/subscription/plan', '/subscription/business-plan', '/subscription/business-plan-purchase'];
  const currentUrl = event.url;

  if (publicRoutes.includes(currentUrl)) {
    this.handlePublicRoutes(currentUrl);
  } else {
    this.handleProtectedRoutes();
  }

  if (!currentUrl.includes('/review/my-profile-reviews/respond')) {
    localStorage.removeItem('userReview');
  }
}

handlePublicRoutes(url: string) {
  const currentUrl = this.router.url;
   this.path = new URL(environment.domain + currentUrl).pathname; 
  const accessToken = localStorage.getItem("access_token");
  const loginType = localStorage.getItem("login_type");
  const emailVerified = localStorage.getItem("email_verified");
  const subscriptionPlanType = localStorage.getItem("subscriptionPlanType");

  if (accessToken && loginType === 'after_login') {
    if (subscriptionPlanType === '0') {
      this.router.navigateByUrl('/subscription/plan');
    } else if(subscriptionPlanType !== '0' && localStorage.getItem('confirm')=='false'){
      this.router.navigateByUrl(localStorage.getItem('user_type') === 'CARRIER' ? '/profile/overview' : localStorage.getItem('user_type') === 'BROKER' ? 'profile/broker-overview'  : '/profile/non-carrier-overview');;
    }
     else if ((url=='/' || url == '/subscription/plan' )&& subscriptionPlanType !== '0') {
      this.router.navigateByUrl(localStorage.getItem('user_type') === 'CARRIER' ? '/profile/overview' : localStorage.getItem('user_type') === 'BROKER' ? 'profile/broker-overview'  : '/profile/non-carrier-overview');
    }
    else if(url.includes('/sign-in')  ){ //url.includes('/sign-up-user-type')
      this.router.navigateByUrl(localStorage.getItem('user_type') === 'CARRIER' ? '/profile/overview' : localStorage.getItem('user_type') === 'BROKER' ? 'profile/broker-overview'  : '/profile/non-carrier-overview');;
    }
// this contidition only for if user already logging and want to cliam the profile
    // else if(this.path = '/carrier-sign-up' ){ 
    //   this.router.navigateByUrl(localStorage.getItem('user_type') === 'CARRIER' ? '/profile/overview' : '/profile/non-carrier-overview');
    // }
    else if(url.includes('/carrier-profile-claim-premium')||url.includes('/broker-profile-claim') ||url.includes('/carrier-profile-claim') || url.includes('/sign-up-user-type')){
      this.router.navigateByUrl('/subscription/manage')
    }
    
    // END
    this.updateLoginStatus(true);
  } else if (accessToken && loginType === 'before_login') {
    if (emailVerified === 'false') {
      this.router.navigateByUrl('/verify-otp');
    } else if (emailVerified === 'true' && subscriptionPlanType === '0') {
      this.router.navigateByUrl('/subscription/plan');
      this.updateLoginStatus(false);
    } else {
      this.updateLoginStatus(false);
    }
  } else {
    if (url === '/subscription/plan' || url === '/subscription/business-plan') {
      this.router.navigateByUrl('/sign-in');
    }
    this.updateLoginStatus(false);
  }
}

handleProtectedRoutes() {
  const accessToken = localStorage.getItem("access_token");
  const loginType = localStorage.getItem("login_type");
  const subscriptionPlanType = localStorage.getItem("subscriptionPlanType");

  if (accessToken && loginType === 'before_login') {
    if (localStorage.getItem("email_verified") === 'false') {
      this.router.navigateByUrl('/verify-otp');
    } else if (localStorage.getItem("email_verified") === 'true' && subscriptionPlanType === '0') {
      this.router.navigateByUrl('/subscription/plan');
      this.saveRedirectUrl(this.router.url);
      this.updateLoginStatus(false);

    } else {
      this.updateLoginStatus(false);
    }
  } else if (accessToken && loginType === 'after_login' && subscriptionPlanType !== '0') {
    this.updateLoginStatus(true);
  }
}

updateLoginStatus(isLoggedIn: boolean) {
  this.isLoggedIn = isLoggedIn;
  const body = document.getElementsByTagName('body')[0];
  if (isLoggedIn) {
    body.classList.remove('hidden_side_menu', 'before_after_login');
    body.classList.add('app_after_login');
  } else {
    body.classList.add('hidden_side_menu', 'before_after_login');
    body.classList.remove('app_after_login');
  }
}

getConfig() {
  let uri = null;
  let newParams = {};
  if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
  let APIparams = {
    apiKey: AppSettings.APIsNameArray.EXTRA.CONFIG,
    uri: uri,
  };
  this.commonService.getList(APIparams).subscribe((ServerRes) => {
    if (ServerRes.success === true) {
      this.sharedService.setConfig(ServerRes.response);
      this.commonService.configData.next(ServerRes.response);
    }
  });
}

getUserProfile() {
  let uri = null;
  let newParams = {};
  if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
  let APIparams = {
    apiKey: this.sharedService.getUrl(),
    uri: uri,
  };
  this.commonService.getList(APIparams).subscribe((ServerRes) => {
    if (ServerRes.success === true) {
      localStorage.setItem('subscriptionPlanType', ServerRes.response?.subscriptionPlanType);
      localStorage.setItem('login_type', ServerRes.response?.subscriptionPlanType == 0 ? 'before_login' : 'after_login');
      ServerRes?.response?.subscriptionPlanType == 0 ? this.updateLoginStatus(false) : this.handlePublicRoutes('')
      ServerRes?.response?.subscriptionPlanType ==0 ? localStorage.setItem('confirm','false') : localStorage.setItem('confirm','true')
      this.sharedService.setInfo(ServerRes.response);
      this.sharedService.userDataPass.next(ServerRes.response);
      this.skeletonLoader = false;
    }
    else {
      this.skeletonLoader = false;
    }
  });
}

userCheckLogin() {
  if (localStorage.getItem("access_token") && localStorage.getItem("login_type") === 'after_login') {
    this.updateLoginStatus(true);
  } else {
    this.updateLoginStatus(false);
  }
}

// save redirect url
saveRedirectUrl(url: any) {
  if(url.includes('/review/write-a-review')){
  localStorage.setItem('redirectUrl', url);
  }
}
}

