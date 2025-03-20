// set brokerid in local 
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public toggleDropdown: boolean = false;
  public toggleDropdownReview: boolean = false;
  public togglePerformanceAnalytics: boolean = false;
  public toggleDropdownBrowseHistory: boolean = false;
  public toggleDropdownRcalculatorReview: boolean = false;
  public toggleDropdownDigitalMarketing: boolean = false;
  public toggleDropdownForecastAvailability: boolean = false;
  public toggleDropdownCarrier: boolean = false;
  public toggleDropdownFindCarrier: boolean = false;
  public getUserData: any;
  public userType: any;
  public totalStrenth: any = 0;
  public strengthdisabled = true;
  public activeSubTab: any;
  routeSub: any;
  public isMobile = false;
  constructor(
    private sharedService: SharedService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.checkMediaQuery();
    window.addEventListener('resize', () => this.checkMediaQuery());

    this.routeSub = this.router.events.subscribe((event) => {
      if (event) {
        if (event instanceof NavigationEnd) {
          if ((event.url.includes('my-saved-carrier')) || (event.url.includes('/my-saved-carrier-list/'))) {
            this.activeSubTab = 'mySavedCarriers';
          }
          else if (event.url.includes('/review/write-a-review')) {
            this.activeSubTab = 'writeReview';
            // this.toggleDropdownReview = !this.toggleDropdownReview;
          }
          else if (event.url.includes('/review/non-carrier-manage-reviews') || event.url.includes('review/edit-a-review-for-carrier') ||  event.url.includes('review/edit-a-review-for-broker')) {
            this.activeSubTab = 'manageReview';
            // this.toggleDropdownReview = !this.toggleDropdownReview;
          }
          else if (event.url.includes('/review/non-carrier-review-invitation') || event.url.includes('review/edit-a-review-for-carrier')) {
            this.activeSubTab = 'reviewInvitation';

            // this.toggleDropdownReview = !this.toggleDropdownReview;

          }
          else if (event.url.includes('/profile-performance/profile-viewers') ) {
            this.activeSubTab = 'profileViewers';
          }
          else if (event.url.includes('/browse-history/trucking-companies') ) {
            this.activeSubTab = 'truckingCompanies';
          }
          else if (event.url.includes('/browse-history/brokerage-companies') ) {
            this.activeSubTab = 'brokerageCompanies';
          }
          else if (event.url.includes('review/invite-for-review') || event.url.includes('review/edit-a-review-for-carrier')) {
            this.activeSubTab = 'inviteReview';
          }
          else if (event.url.includes('/review/manage-my-reviews')) {
            this.activeSubTab = 'manageMyReview';
          }
          else if (event.url.includes('/calculator/cost-per-miles')) {
            this.activeSubTab = 'calculatorMile';
          }
          else if (event.url.includes('/carrier-data-exports/find-carriers')) {
            this.activeSubTab = 'find-carriers';
            // this.toggleDropdownFindCarrier = !this.toggleDropdownFindCarrier;

          }
          else if (event.url.includes('/carrier-data-exports/download-report')) {
            this.activeSubTab = 'download-report';
            // this.toggleDropdownFindCarrier = !this.toggleDropdownFindCarrier;

          }
          else if (event.url.includes('/calculator/monthly-cost')) {
            this.activeSubTab = 'calculatorMonth';
          }
          else if (event.url.includes('/calculator/manage-cp-mile')) {
            this.activeSubTab = 'manage-cp-mile';
          }
          else if (event.url.includes('/calculator/manage-cp-month')) {
            this.activeSubTab = 'manage-cp-month';
          }
          else if (event.url.includes('/review/pending-review-invitation')) {
            this.activeSubTab = 'pendingReviewInvitation';
          }
          //Digital Marketing 
          else if (event.url.includes('/digital-marketing/seo')) {
            this.activeSubTab = 'seo';
          }
          else if (event.url.includes('/digital-marketing/analytics')) {
            this.activeSubTab = 'analytics';
          }
          else if (event.url.includes('digital-marketing/social-media')) {
            this.activeSubTab = 'social-media';
          }
          else if (event.url.includes('my-truck-availability/post-new')) {
            this.activeSubTab = 'post-new';
          }
          else if (event.url.includes('/my-truck-availability')) {
            this.activeSubTab = 'my-truck-availability';
          }
          else if (event.url.includes('performance-analytics/profile-analytics')) {
            this.activeSubTab = 'profileAnalytics';
          }
          else if (event.url.includes('performance-analytics/contact-lead')) {
            this.activeSubTab = 'contactLead';
          }

          // else if (event.url.includes('carrier/carrier-search')) {
          //   this.activeSubTab = 'carrier-search';
          //   // this.toggleDropdownCarrier = !this.toggleDropdownCarrier;


          // }
          // else if (event.url.includes('carrier/report')) {
          //   this.activeSubTab = 'report';
          //   // this.toggleDropdownCarrier = !this.toggleDropdownCarrier;


          // }
          else {
            this.activeSubTab = '';
          }
        }
      }
    });
    this.sharedService.updateTokenData.subscribe((userData) => {
      this.userCheckLogin();
    });
    this.userCheckLogin();
    this.userType = localStorage.getItem('user_type');
    this.sharedService.logOutuser.subscribe((userData) => {
      this.getUserData = "";
    });

    let userDetail;
    userDetail = this.sharedService.getInfo();
    if (userDetail && userDetail !== null) {
      this.getUserData = userDetail;
      if (localStorage.getItem('user_type') == 'CARRIER') {
        localStorage.setItem('carrierID', userDetail?.id);
      }
      else if (localStorage.getItem('user_type') == 'BROKER') {
        localStorage.setItem('BrokerID', userDetail?.brokerId);
      }
      this.userInfo(userDetail);
    }
    this.sharedService.userDataPass.subscribe((userData) => {
      if (userData && this.getUserData === undefined) {
        if (localStorage.getItem('user_type') == 'CARRIER') {
          let data: any = userData;
          localStorage.setItem('carrierID', data.id);
        }
        if (localStorage.getItem('user_type') == 'BROKER') {
          let data: any = userData;
          localStorage.setItem('BrokerID', data.brokerId);
        }
        this.userInfo(userData);
      }
    });
  }

  checkMediaQuery(): void {
    this.isMobile = window.matchMedia('(max-width: 767px)').matches;
  }

  mobMenuToggleEvent(){
    this.sharedService.togglechange()


  }
  userCheckLogin() {
    if (localStorage.getItem("access_token")) {
      this.userType = localStorage.getItem('user_type');
    } else {
      this.userType = localStorage.getItem('user_type');
    }
  }
  userInfo(userDtail) {
    this.getUserData = userDtail;
    let newLength: any;
    newLength = this.sharedService.otherUserStrenth(userDtail);
    this.totalStrenth = newLength.totalth;
  }

  menuToggleEvent(event, type) {
    if (type == 'profile') {
      event.preventDefault();
      this.toggleDropdown = !this.toggleDropdown;
    } else if (type == 'review') {
      event.preventDefault();
      this.toggleDropdownReview = !this.toggleDropdownReview;
    } else if (type == 'performanceAnalytics') {
      event.preventDefault();
      this.togglePerformanceAnalytics = !this.togglePerformanceAnalytics;
    } else if (type == 'browseHistory') {
      event.preventDefault();
      this.toggleDropdownBrowseHistory = !this.toggleDropdownBrowseHistory;
    } else if (type == 'digitalMarketing') {
      event.preventDefault();
      this.toggleDropdownDigitalMarketing = !this.toggleDropdownDigitalMarketing;
    } else if (type == 'forecastAvailibilty') {
      event.preventDefault();
      this.toggleDropdownForecastAvailability = !this.toggleDropdownForecastAvailability;

    } else if (type == 'carrier') {
      event.preventDefault();
      this.toggleDropdownCarrier = !this.toggleDropdownCarrier;
    }
    else if (type == 'find-carriers') {
      event.preventDefault();
      this.toggleDropdownFindCarrier = !this.toggleDropdownFindCarrier;
    }
    else if (type == 'calculatorReview') {
      event.preventDefault();
      this.toggleDropdownRcalculatorReview = !this.toggleDropdownRcalculatorReview;
    }

  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.sharedService.logOutuser.next(null);
    this.sharedService.updateTokenData.next(null);
    this.sharedService.setInfo(null);
    this.router.navigate(['/sign-in'])
  }
  refreshTab() {
    location.reload();
  }
  showStrength(totalStrenth: any) {
    return Math.round(totalStrenth);
  }
  activeMenu(type) {
    if (type == 'mySavedCarriers') {
      this.router.navigateByUrl('/my-saved-carriers')
      this.activeSubTab = 'mySavedCarriers'
    }
  }

}
