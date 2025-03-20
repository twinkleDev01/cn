import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.scss']
})
export class DownloadReportComponent implements OnInit {
  reportList = [];
  loader = false;
  spinner=false;
  totalPage:any;
  totalRecords:any;
  page = 1;
  queryParamValue:any;
  public param :any;
  public getTotalHeight:any;
  public scrolled:any;
  public dataNotFound = false;




  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    this.scrolled=$(window).scrollTop()
    if ($(document).height()-$(window).scrollTop() <= $(window).height()+1) {
      if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.reportList?.length > 0 && !this.spinner) {
        this.page = this.page + 1;
        this.dataNotFound = false;
        this.reportGetAPIMore();
      } else if (this.loader === false) {
        this.dataNotFound = true;
      }
    }
  }


  constructor(private router: Router,private commonService: CommonService,public dialog: MatDialog,  public activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
  this.reportGetAPI(null)
  }

  ngAfterViewInit() {
    this.activatedRoute.queryParamMap.subscribe((value)=>{
      this.queryParamValue = value['params']
      this.reportGetAPI(this.queryParamValue)
    })
    
  }
  
  reportGetAPI(queryParams) { 
    queryParams = this.removeEmptyValues(queryParams);
    this.loader = true;
    let uri = null;
    queryParams = this.convertArraysToCommaSeparatedStrings(queryParams); // Convert arrays to comma-separated strings
    let newParams = { page: this.page, limit: 10, ...queryParams };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.CARRIERSEARCH.REPORTS,
      uri: uri,
    };
    this.router.navigate(['/carrier-data-exports/download-report'], { queryParams: queryParams });
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.loader = false;
        this.reportList = ServerRes.response.allReports;
        this.totalPage = ServerRes.response.totalPage;
        this.totalRecords = ServerRes.response.totalRecords;
      }else if(ServerRes.success === false) {
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
    }); 
  }

  removeEmptyValues(obj) {
    for (let key in obj) {
      if (obj[key]==0 ||obj[key]==''||obj[key]==0) {
        delete obj[key];
      }
    }
    return obj;
  }

  convertArraysToCommaSeparatedStrings(params) {
    const newParams = {};
    for (const key in params) {
      if (Array.isArray(params[key])) {
        newParams[key] = params[key].join(',');
      } else {
        newParams[key] = params[key];
      }
    }
    return newParams;
  }

  filterPopup()
  {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "670px",
      height:"auto",
      data: { openPop: 'downloadReportFilter', loadData:this.queryParamValue },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "ok") {
        this.param=result.value;
        this.reportGetAPI(result.value)

      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  reportGetAPIMore()
  {
    this.spinner = true;
    let uri = null;
    let newParams = {page:this.page,limit:10, ...this.param};
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.CARRIERSEARCH.REPORTS,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.spinner = false;
        if(ServerRes.response.allCarrier)
         this.reportList=[...this.reportList, ...ServerRes.response.allCarrier]
         this.totalPage= ServerRes.response.totalPage
         this.totalRecords= ServerRes.response.totalRecords
      }
    },(error)=>{
        this.spinner=false
    }); 
  }
}
