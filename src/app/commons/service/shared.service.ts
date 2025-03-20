import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppSettings } from '../../commons/setting/app_setting';
import { AlertService } from '../service/alert.service';
import { CommonService } from '../service/common.service';

// hotjar.d.ts
// hotjar.d.ts (or any TypeScript declaration file)
declare global {
  interface Window {
    attachEvent: any;
    dataLayer: any;
    hj: any;
    _hjSettings: any;
  }
}

@Injectable({
  providedIn: 'root',
})

export class SharedService {
  public _config: any;
  public _address: any;
  public _userInfo:any;
  public userDataPass = new Subject<string>();
  public logOutuser = new Subject<string>();
  public updateTokenData = new Subject<string>();
  public updateUserType = new Subject<string>();
  public mobMenuToggleEventService = new Subject<void>();
  currentMessage = this.mobMenuToggleEventService.asObservable();
  constructor(
    public commonService: CommonService,
    public alertService: AlertService,
  ) { }
  
  togglechange(){
this.mobMenuToggleEventService.next()

  }
 getUrl(){
  let url;
  if(localStorage.getItem("user_type")=='CARRIER'){
    url = AppSettings.APIsNameArray.USER.GET;
  }else if(localStorage.getItem("user_type")=='BROKER'){
    url = AppSettings.APIsNameArray.USER.BROKERGET
  }else if(localStorage.getItem("user_type")=='SHIPPER'){
    url = AppSettings.APIsNameArray.USER.SHIPPERGET
  }else if(localStorage.getItem("user_type")=='SELLER'){
    url = AppSettings.APIsNameArray.USER.SELLERGET
  }else if(localStorage.getItem("user_type")=='DISPATCHER'){
    url=AppSettings.APIsNameArray.USER.DISPATCHERGET
  }
  return url;
 }


 updateUserUrl(){
  let url;
  if(localStorage.getItem("user_type")=='CARRIER'){
    url = AppSettings.APIsNameArray.USER.UPDATE;
  }else if(localStorage.getItem("user_type")=='BROKER'){
    url = AppSettings.APIsNameArray.USER.BROKERUPDATE;
  }else if(localStorage.getItem("user_type")=='SHIPPER'){
    url = AppSettings.APIsNameArray.USER.SHIPPERUPDATE;
  }else if(localStorage.getItem("user_type")=='SELLER'){
    url = AppSettings.APIsNameArray.USER.SELLERUPDATE;
  }else if(localStorage.getItem("user_type")=='DISPATCHER'){
    url=AppSettings.APIsNameArray.USER.DISPATCHERUPDATE;
  }
  return url;
 }

 userRegistration(){
  let url;
  if(localStorage.getItem("user_type")=='BROKER'){
    // url = AppSettings.APIsNameArray.AUTH.BROKERADD
  }else if(localStorage.getItem("user_type")=='SHIPPER'){
    url = AppSettings.APIsNameArray.AUTH.SHIPPERADD
  }else if(localStorage.getItem("user_type")=='SELLER'){
    url = AppSettings.APIsNameArray.AUTH.SELLERADD
  }else if(localStorage.getItem("user_type")=='DISPATCHER'){
    url=AppSettings.APIsNameArray.AUTH.DISPATCHERADD
  }
  return url;
 }
   getFirstLetter(name) {
    let acronym;
    let countLength;
    if(name) {
      acronym = name.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '');
      countLength = acronym.length;
      if (countLength === 1) {
        acronym = name.substr(0, 2).toUpperCase();
      } else if (countLength >= 2) acronym = acronym.substr(0, 2).toUpperCase();
    } else acronym = '';
    return acronym;
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  public getConfig() {
    return this._config;
  }

  public setConfig(value: any) {
    if (value !== 'undefined') {
      this._config = value;
    }
  }

  public getAddress() {
    return this._address;
  }

  public setAddress(value: any) {
    if (value !== 'undefined') {
      this._address = value;
    }
  }
  public getInfo() {
    return this._userInfo;
  }

  public setInfo(value: any) {
    if (value !== 'undefined') {
      this._userInfo = value;
    }
  }
  otherUserStrenth(info: any) {
    let numberOfFiled = 10;
    let fullStrenth = 100;
    let totalth = 0;
    let remainingPoints = { totalth: totalth, otherData: [] }
    let numberOfValue = fullStrenth / numberOfFiled;
  
    if(info.firstName !== null ||  info.lastName !== null){
      totalth += numberOfValue;
    }
    if(info.email && info.email !== null ){
      totalth += numberOfValue;
    }
    if(info.phone && info.phone !== null){
      totalth += numberOfValue;
    }
    if(info.profileImage && info.profileImage !== null){
      totalth += numberOfValue;
    }
    if(info.coverImage && info.coverImage !== null){
      totalth += numberOfValue;
    }
    if(info.targetJobMarket && info.targetJobMarket !== null){
      totalth += numberOfValue;
    }
    if(info.availability && info.availability !== null){
      totalth += numberOfValue;
    }
    if(info.shipmentTypes && info.shipmentTypes !== null){
      totalth += numberOfValue;
    }
    if(info.equipmentType && info.equipmentType.length > 0){
      totalth += numberOfValue;
    }
    if(info.preferredRegions && info.preferredRegions.length > 0){
      totalth += numberOfValue;
    }
    
    remainingPoints.totalth = totalth;
    return remainingPoints;
  }

  
//     // Google Analytics Script GA
//  loadGAScript(){
//   const script = document.createElement('script');
//   script.async = true;
//   script.src = 'https://www.googletagmanager.com/gtag/js?id=G-5HFZBYK70W';
//   document.head.appendChild(script);

//   window.dataLayer = window.dataLayer || [];
//   function gtag(...args: any[]): void {
//       window.dataLayer.push(args);
//   }
//   gtag('js', new Date());
//   gtag('config', 'G-5HFZBYK70W', {
//       'link_attribution': true
//   });
// };


  loadGTMScript(){
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=GTM-MHS68ZFB`;

  // Ensure dataLayer is defined before pushing to it
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  script.onload = () => {
  };

  script.onerror = () => {
  };

  // Insert the script tag
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);  // Fallback in case there's no script in the DOM
  }
};

// NoScript iframe for GTM
 loadGTMNoScript(){
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-MHS68ZFB';
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);
};

//hotjar
loadHotjarScript() {
  (function (h, o, t, j, a, r) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: 5052685, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script');
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  // this.isHotjarScriptLoaded = true;
}


}
