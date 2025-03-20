import { A } from '@angular/cdk/keycodes';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-carriers-list',
  templateUrl: './my-carriers-list.component.html',
  styleUrls: ['./my-carriers-list.component.css']
})
export class MyCarriersListComponent {
  carrierList: any;
  carrierListLength: any;
  public skeletonLoader:boolean =false;
  public seeCarrierList:boolean=false;
  public loading:boolean=false;
  public carrierSaveListName:any;
  carrierListData: any;
  public getTotalHeight:any
  public page = 1;
  public totalPage = 1;
  public totalRecords:any;
  public spinnerLoader = false;
  public dataNotFound = false;
  public userVerification:any;
  public carrierOperation:any;
  public carrierOperationName:any;
  public InsuranceTypeName:any=[];
  public InsuranceTypes:any;
  public configData:any;

  constructor(  public alertService: AlertService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private sharedService:SharedService
    ) { }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll(event) {
      this.getTotalHeight = window.innerHeight + window.scrollY;
      if ($(window).scrollTop() + 1 >=$(document).height() - $(window).height()) {
        if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.carrierListData?.length > 0) {
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
    this.userVerification = StatusSetting.userVerification;
    this.carrierOperation = StatusSetting.carrierOperation;
    // this.skeletonLoader=true;
    let configValue = this.sharedService.getConfig();

    if (configValue !== undefined) {
      this.getConfigSet(configValue);
    }
    this.commonService.configData.subscribe((userData) => {
      this.getConfigSet(userData);
    });
    this.seeCarrier()

  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  getConfigSet(configValue: any) {
    this.configData = configValue?.InsuranceTypes
  }



  // if a user click on save list then he comes on that page
  seeCarrier(){
    this.skeletonLoader = true;

    this.page=1;
    this.seeCarrierList = true;
        let uri = null;
    let newParams = {
      limit : '4',
      page:1,
      
      listId:this.route.snapshot['params']?.Id,
    };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.SAVECARRIRLIST.SAVELIST,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.carrierSaveListName=ServerRes.response?.saveListName
        this.carrierListData = ServerRes.response.carrierData;
        this.totalPage = ServerRes.response.totalPages;
        this.totalRecords = ServerRes.response?.totalRecords;
        for (let index = 0; index < this.carrierListData?.length; index++) {
          for (let subIndex = 0; subIndex < this.carrierOperation?.length; subIndex++) {
            if (this.carrierOperation[subIndex].id == this.carrierListData[index].carrierOperation) {
              this.carrierOperationName = this.carrierOperation[subIndex].name;
            }
          }
        
        }
        this.skeletonLoader=false;
      }else{
        this.carrierListData = [];
        this.skeletonLoader=false;
      }
    },(error) => {
      this.carrierListData = [];
      this.skeletonLoader=false;
    });
  }

  // fetch insurence type 
  getInsuranceName(insuranceType: number): string {
    const insurance = this.configData.find((insuranceData:any) => insuranceData.id === insuranceType);
    return insurance ? insurance.name : '-';
  }

  confirmItem(showCarrie,carrierID:any,saveListID:any,index:any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      // backdropClass: AppSettings.backdropClass,
      backdropClass: 'cn_custom_popup',
      width: '460px',
      data: {
        openPop: 'removeSaveCarrier',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {
        let selectCarrier = this.carrierListData?.findIndex(saveListId => saveListId===saveListID);   
        if(selectCarrier){
          this.deleteListItem(showCarrie,selectCarrier)
        }
      }
    });
  }
  // save-list/delete
  deleteListItem(showCarrie:any,selectCarrier:any){
    this.loading=true;
    let uri =null;
    let newParams = {
      listId: showCarrie?.saveListId,
      carrierId:showCarrie?.id
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.NONCARRIERSAVELIST.REMOVE,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe(
      (success) => {
        if (success.success === true) {
          this.loading=false;
          this.carrierListData.splice(this.carrierListData.indexOf(selectCarrier),1);
        this.carrierListData = [];
          this.page = 1;
          this.seeCarrier()
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Remove Saved Carrier',
            'You have successfully removed saved carrier.'
          );
         
        } else if (success.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'cancel',
            'Remove Saved Carrier',
            'There is some issue, Please try again'
          );
        }
      },
      (error) => {
        this.alertService.showNotificationMessage(
          'danger',
          'bottom',
          'left',
          'txt_g',
          'error',
          'Unexpected Error',
          AppSettings.ERROR
        );
        this.loading=false;
      }
    );
  }

  getAPIParam() {
    let APIparams, params;
    params = { limit: 4, page: this.page,listId:this.route.snapshot['params']?.Id,};
    let url;
    url = AppSettings.APIsNameArray.SAVECARRIRLIST.SAVELIST;
    APIparams = {
      apiKey: url,
      uri: this.commonService.getAPIUriFromParams(params),
    };
    return APIparams;
  }

  getMoreData() {
    var APIparams = this.getAPIParam();
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      let result = ServerRes.response.carrierData;
      this.spinnerLoader = false;
      if (
        ServerRes.response.carrierData &&
        ServerRes.response.carrierData?.length > 0
      ) {
        for (let v = 0; v < result.length; v++) {
          if (result[v]) this.carrierListData.push(result[v]);
        }
      }
    });
  }

  redirectPageCarrier(dotNumber:any,companyName:any){
    let newCompanyName = companyName.replace(/\s/g, '-').toLowerCase();
    window.location.href = environment.domain+"/carrier-profile/"+ dotNumber + "/" +newCompanyName + "/#review";
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
}

