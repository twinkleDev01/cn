import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-write-a-review',
  templateUrl: './write-a-review.component.html',
  styleUrls: ['./write-a-review.component.css']
})

export class WriteReviewComponent implements OnInit {
  public page:any=1;
  public totalItems:any;
 public showEditReviewPage:boolean=false;
  public searchStr:any;
  public matSelect =false;
  public cancelRequestUser: any = null;
  public errorMessage:any
  public selectedValue = 'Carrier';

  public srcPrtBox="";
  public regionListlength: any;
  public regionsList:any = [];
  public emtpyData=false;
  public loaderSearch :boolean = false;
  public loaderSearchKey:boolean=false;
  public skeletonLoader = false;
  public reviewData: any;
  public selectCarrierData: any;
  public loading =false;
  public getTotalHeight:any;
  public totalPage:any;
  public spinnerLoader = false;
  public dataNotFound = false;
  private searchSubject: Subject<string> = new Subject();



  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    public alertService: AlertService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog){
      this.searchSubject.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(value => {
        // Call your search function here
        this.searchRecord(value);
      });
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(event) {
      this.getTotalHeight = window.innerHeight + window.scrollY;
      if ($(window).scrollTop() + 1 >=$(document).height() - $(window).height()) {
        if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.reviewData?.length > 0) {
          this.page = this.page + 1;
          this.spinnerLoader = true;
          this.dataNotFound = false;
          this.getMoreData();
        } else if (this.spinnerLoader === false) {
          this.dataNotFound = true;
        }
      }
    }

  ngOnInit(): void {

  }
 
  selectPickCountryCode(value: string) {
    this.selectedValue = value;
    // Handle the selection change
  }

  searchUserType(event: any) {
    if (this.cancelRequestUser) {
      this.cancelRequestUser.unsubscribe();
    }
    this.matSelect=true
    this.srcPrtBox ="active_src_rslt";
    this.emtpyData=false;
    this.loaderSearch=true;
    this.searchStr = event.target.value;
    if(this.searchStr && this.searchStr.length >= 4){
      this.errorMessage=null
      this.searchSubject.next(this.searchStr);
    }else{
      this.loaderSearch=false;
      this.errorMessage='Minimum length should be 4 digits/letters'

    }


  }

  getAPIInParam(searchStr) {
    let APIparams, params;
    if (searchStr) params = {limit :'10',page:this.page, search: searchStr };
    else params = { };
    // dynamic api
    if(this.selectedValue == 'Broker'){
      APIparams = {
        apiKey: AppSettings.APIsNameArray.EXTERNAL.BROKERSEARCH,
        uri: this.commonService.getAPIUriFromParams(params),
      };
    }else{
      APIparams = {
        apiKey: AppSettings.APIsNameArray.EXTERNAL.CARRIERSEARCH,
        uri: this.commonService.getAPIUriFromParams(params),
      };
    }
    
    return APIparams;
  }
  
  searchRecord(searchStr:any){
      var APIparams = this.getAPIInParam(searchStr);
      this.commonService.getList(APIparams).subscribe((ServerRes) => {
        if(ServerRes?.success==true){
          this.loaderSearch = false;
          this.emtpyData=true;
          this.reviewData = ServerRes.response?.searchData;
          this.totalPage=ServerRes.response?.totalPages;
          this.totalItems=ServerRes.response?.totalItems
          this.commonService.configData.next(this.reviewData);
        }
        else{
          this.reviewData=[];
          this.totalPage=0;
        }
      });
  }

  closeSearch(){
    this.srcPrtBox ="";
  }


  redirectPageCity(carrierData:any,dotNumber:any){
    if(this.selectedValue == 'Broker'){
    if(carrierData){
      this.showEditReviewPage=true;
    this.router.navigateByUrl('/review/write-a-review-for-broker?brokerId='+carrierData?.id)
    }
  }else{
      if(carrierData){
        this.showEditReviewPage=true;
      this.router.navigateByUrl('/review/write-a-review-for-carrier?carrierId='+carrierData?.id)
    }
  }

} 

  getMoreData() {
    var APIparams = this.getAPIInParam(this.searchStr);
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response?.searchData;
      this.spinnerLoader = false;
      if (
        ServerRes.response &&
        ServerRes.response?.searchData?.length > 0
      ) {
        for (let v = 0; v < result?.length; v++) {
          if (result[v]){
            this.reviewData?.push(result[v]);
            this.dataNotFound=false;
          }
        }
      }
    });
  }

  redirectPageCarrier(dotNumber:any,companyName:any){
    let newCompanyName = companyName.replace(/\s+/g, '-').toLowerCase();
    window.location.href = environment.domain+"/carrier-profile/"+dotNumber+"/"+newCompanyName+"/#review";
  }
  getFormattedAddress( city, stateCode, zipShort,countryCode){
    let formattedAddress = '';
    const toTitleCase = (str: string) => 
      str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    if (city) {
      formattedAddress += toTitleCase(city.trim());
    }
    if (stateCode) {
      formattedAddress += ', '+ stateCode.trim() ;  // State codes are usually uppercase
    }
    if (zipShort) {
      formattedAddress += ', ' + zipShort.trim();
    }
    if (countryCode) {
      formattedAddress += ', '+ countryCode.trim();
    }
    formattedAddress = formattedAddress.trim();
    formattedAddress = formattedAddress.replace(/\s+,/g, ',');
    return formattedAddress;
  }

  // Profile analytics table
  displayedColumns: string[] = ['name', 'location',  'dotNo', 'docket', 'fleetSize', 'rowAction'];
  dataSource = [
    { name: 'Jax Logistics LLC',
      dotNo: '12345',
      docket: '82934',
      fleetSize: '08',
      location: '82934, Alachua, Florida',
    },
    { name: 'Jax Logistics LLC 1',
      dotNo: '98786',
      docket: '43232',
      fleetSize: '12',
      location: '43232, Columbus, Ohio',
    },
  ];
}

