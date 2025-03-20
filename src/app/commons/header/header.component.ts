// I have added window.location.origin for correct domain 
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../commons/service/common.service';
import { SharedService } from '../../commons/service/shared.service';
import { AppSettings } from '../../commons/setting/app_setting';
import { StatusSetting } from '../../commons/setting/status_setting';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public srcPrtBox="";
  public review :boolean=false;
  public userType:any;
  public loaderSearch :boolean = false;
  public searchStr:any;
  public searchResult : any = [];
  public cityData : any = [];
  public emtpyData=false;
  public searchData="";
  public getUserData : any;
  public checkLogin =false;
  public checkLoginUserProfile =false;
  public mobile_leftMenu_css=true;
  public serverUrl :any;
  public companyName:any;
  public isSignUp:any=false;
  public urlSignUp:boolean=false;
  private searchSubject: Subject<string> = new Subject();
  public getsearchType:string='carrier';
  public isOpen : boolean = false;
  constructor(
    private commonService: CommonService, 
    private sharedService: SharedService,
    private router: Router,
    private route:ActivatedRoute) {
      this.searchSubject.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(value => {
        // Call your search function here
        this.searchRecord(value);
      });
    }

  ngOnInit(): void {
    this.sharedService.currentMessage.subscribe(()=> {
      this.mobMenuToggleEvent()
    })
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length > 0) {
        if(params.dotNumber){
          this.urlSignUp=true
        }
      }
    })
    if(localStorage.getItem('isSignUp')=='true'){
    this.isSignUp=true
    }
    else if(localStorage.getItem('isSignUp')=='false'){
      this.isSignUp=false
    }
    this.getUserData = this.sharedService.getInfo()
    this.sharedService.userDataPass.subscribe((userDataPass:any) =>{
      if(userDataPass=='update' || userDataPass=='updateImage'){
        this.getUserProfile()
      }
      else if(userDataPass=='SignUp'){
        this.isSignUp=true
      }
      if (this.getUserData==undefined && (userDataPass !=='update' || userDataPass !=='updateImage')) {
        this.getUserData=userDataPass
      }
    })
    this.sharedService.updateUserType.subscribe((userData:any) => {
      if(userData){
        this.userType = localStorage.getItem('user_type');
      }
    });
    this.userType = localStorage.getItem('user_type');
    this.serverUrl = environment.domain;
    this.sharedService.updateTokenData.subscribe((userData) => {
      this.userCheckLogin();
    });
    this.userCheckLogin();

    // Add click listener for hamburger menu
    this.setupHamburgerMenu();
    this.setupHasChildrenToggle();
  }
    
  logoRedirect(){
    if(localStorage.getItem("access_token") && localStorage.getItem("login_type")==='before_login'){
      this.router.navigateByUrl('/')
    }else if(localStorage.getItem("access_token") && localStorage.getItem("login_type")==='after_login'){
      if(localStorage.getItem('user_type') ==='CARRIER'){
        this.router.navigateByUrl('/profile/overview');
      }else if(localStorage.getItem('user_type') ==='BROKER'){
        this.router.navigateByUrl('/profile/broker-overview');
      }else{
        this.router.navigateByUrl('/profile/non-carrier-overview');
      }
    }else{
      if(this.serverUrl==='https://carriernetwork.ai'){
       window.location.href="https://carriernetwork.ai";
      }else{
      this.router.navigateByUrl(this.serverUrl);
      }
    }
  }
  setupHasChildrenToggle() {
    const hasChildrenElements = document.querySelectorAll<HTMLElement>('.has-children');

    hasChildrenElements.forEach((element) => {
      element.addEventListener('click', () => {
        const childUl = element.querySelector('ul');
        if (childUl) {
          const isVisible = childUl.style.display === 'block';
          childUl.style.display = isVisible ? 'none' : 'block';
          childUl.style.transition = 'all 0.5s ease';
        }

        const iconArrow = element.querySelector('.icon-arrow');
        if (iconArrow) {
          iconArrow.classList.toggle('open');
        }
      });
    });
  }

  setupHamburgerMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const bars = document.querySelector('.bar');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburgerMenu && bars && mobileMenu) {
      hamburgerMenu.addEventListener('click', (event) => {
        event.preventDefault();
        bars.classList.toggle('animate');
        mobileMenu.classList.toggle('active');
      });
    }
  }

  userCheckLogin(){
    if(localStorage.getItem("access_token")){
      this.getUserProfile();
      if(localStorage.getItem("login_type")==='after_login'){
        this.checkLogin=true;
        this.checkLoginUserProfile=true;
      }else{
        this.checkLoginUserProfile=false;
        this.checkLogin=true;
      }
    }else{
     this.checkLoginUserProfile=false;
     this.checkLogin=false;
    }
    if(this.userType ==='CARRIER'){
      this.review=false;
    }
    else{
      this.review=true;
    }
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
        this.getUserData = ServerRes.response; 
        localStorage.setItem('subscriptionPlanType',ServerRes.response?.subscriptionPlanType)
        localStorage.setItem('login_type', ServerRes.response?.subscriptionPlanType == 0 ? 'before_login' : 'after_login');
        if( ServerRes.response?.subscriptionPlanType == 0) {
          this.checkLoginUserProfile = true,
          this.checkLogin=true
        }
        else {
          this.checkLogin=true;
          this.checkLoginUserProfile=true;
        }
        ServerRes?.response?.subscriptionPlanType == 0 ? this.router.navigateByUrl('/subscription/plan') : ''
        this.sharedService.setInfo(ServerRes.response);
        this.sharedService.userDataPass.next(ServerRes.response);
      }
    });
  }

  redirectPageCarrier(dotNumber:any,companyName:any){
    let newCompanyName = companyName.replace(/\s+/g, '-').toLowerCase();
    window.location.href = window.location.origin +"/carrier-profile/"+dotNumber+"/"+newCompanyName;
  }
  redirectPageBroker(dotNumber:any,companyName:any){
    let newCompanyName = companyName.replace(/\s+/g, '-').toLowerCase();
    window.location.href = window.location.origin +"/freight-brokerage/"+dotNumber+"/"+newCompanyName;
  }
  redirectPageParking(id:any,companyName:any){
    let newCompanyName = companyName.replace(/\s+/g, '-').toLowerCase();
    window.location.href = window.location.origin +"/truck-parking-profile/"+id+"/"+newCompanyName;
  }

  redirectPageCity(country:any ,state:any,city:any){
    var newstate = state?.replace(/\s+/g, '-').toLowerCase();
    var newcity = city?.replace(/\s+/g, '-').toLowerCase();
    if(country==="US"){
      let filteredValue = StatusSetting.usStateList.filter(function (item) {
        return item.code == state;
        });	
      let newstate = filteredValue[0].urlSlug;
      if(this.getsearchType ==='carrier'){
        window.location.href = window.location.origin+"/trucking-companies"+"/"+"united-states"+"/"+newstate+"/"+newcity;
      }else if(this.getsearchType ==='broker'){
        window.location.href = window.location.origin+"/freight-brokerages"+"/"+"united-states"+"/"+newstate+"/"+newcity;
      }else if(this.getsearchType ==='parking'){
        window.location.href = window.location.origin+"/truck-parking"+"/"+"united-states"+"/"+newstate+"/"+newcity;
      }
    }
    if(country==="CA" || country==="CANADA"){
      let filteredValue = StatusSetting.caStateList.filter(function (item) {
        return item.code == state;
        });

      let newstate = filteredValue[0].urlSlug;
      if(this.getsearchType ==='carrier'){
        window.location.href = window.location.origin+"/trucking-companies"+"/"+"canada"+"/"+newstate+"/"+newcity;
      }else if(this.getsearchType ==='broker'){
        window.location.href = window.location.origin+"/freight-brokerages"+"/"+"canada"+"/"+newstate+"/"+newcity;
      }else if(this.getsearchType ==='parking'){
        window.location.href = window.location.origin+"/truck-parking"+"/"+"canada"+"/"+newstate+"/"+newcity;
      }
    }  
    if(country==="MX" || country==="MAXICO"){
      let filteredValue = StatusSetting.mxStateList.filter(function (item) {
        return item.code == state;
        });
      let newstate = filteredValue[0].urlSlug;
      window.location.href = window.location.origin+"/trucking-companies"+"/"+"maxico"+"/"+newstate+"/"+newcity;
    }
  }
 
  searchUserType(event: any) {
    this.loaderSearch=true;
    this.srcPrtBox ="active_src_rslt";
    this.emtpyData=false;
    this.searchStr = event.target.value;
    if(this.searchStr.length > 0){
      // this.searchRecord(this.searchStr);
      this.searchSubject.next(this.searchStr);
    }else{
      // this.searchRecord(null);
      this.loaderSearch=false;
      this.cityData = [];
      this.searchResult = []
    }
  }

  closeSearch(inputField: HTMLInputElement) {
    this.srcPrtBox ='';
    inputField.value = '';
  }

  getAPIInParam(searchStr) {
    let APIparams, params;
    if (searchStr) params = {searchFor:this.getsearchType,  search: searchStr };
    else params = {  };
    APIparams = {
      apiKey: AppSettings.APIsNameArray.USER.SEARCH,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }
  
  searchRecord(searchStr:any){
      var APIparams = this.getAPIInParam(searchStr);
      this.commonService.getList(APIparams).subscribe((ServerRes) => {
        console.log(ServerRes?.response, 'this.ServerRes.response');
        if(ServerRes.response){
        this.cityData = ServerRes?.response.cityData;
        this.searchResult = ServerRes.response;
        }
        this.loaderSearch = false;
        this.emtpyData=true;
      });
  }

  logout(){
    this.getUserData="";
    this.checkLoginUserProfile=false;
    this.checkLogin = false;
    localStorage.clear();
    sessionStorage.clear();
    this.sharedService.logOutuser.next(null);
    this.sharedService.updateTokenData.next(null);
    this.sharedService.setInfo(null);
    this.router.navigate(['/sign-in'])
  }
  mobMenuToggleEvent() {
    this.mobile_leftMenu_css=!this.mobile_leftMenu_css;
    const body = document.getElementsByTagName('body')[0];
    const menu = document.querySelector('.mobile-menu');
    if (!this.mobile_leftMenu_css) {
      // Add 'active_head_menu' to the body
      body.classList.add('active_head_menu');
      // Add 'active' to the mobile menu and remove 'inactive'
      menu?.classList.add('active');
      // menu?.classList.remove('');
    } else {
      // Remove 'active_head_menu' from the body
      body.classList.remove('active_head_menu');
      // Add 'inactive' to the mobile menu and remove 'active'
      // menu?.classList.add('');
      menu?.classList.remove('active');
    }
  }
  writeReview(){
    if(window.matchMedia('(max-width: 767px)').matches){
      this.mobMenuToggleEvent()
      }
    if ( localStorage.getItem('login_type')==='before_login'){
      this.router.navigate(['/sign-in'])
    }else {
      this.router.navigate(['/review/write-a-review'])
    }
  }
  redirectSignSignUp(type){
    if(window.matchMedia('(max-width: 767px)').matches){
    this.mobMenuToggleEvent()
    }
    if(type=='SignUp'){
      this.router.navigateByUrl('/sign-up-user-type')
      this.isSignUp=true;
      localStorage.setItem('isSignUp',this.isSignUp)
    }
    else if(type=='SignIn'){
      this.router.navigateByUrl('/sign-in')
      this.isSignUp=false
      localStorage.setItem('isSignUp',this.isSignUp)
    }
  }
  selectSearchtype(value: string) {
    this.getsearchType = value;
    this.cityData = [];
    this.searchResult = []
    this.emtpyData=false;
    // Handle the selection change
  }
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Prevent the event from bubbling
    this.isOpen = !this.isOpen;
  }
}
