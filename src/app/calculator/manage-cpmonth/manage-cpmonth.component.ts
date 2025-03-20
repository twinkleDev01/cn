import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fakeJson } from 'src/app/commons/fakeDataService/fakeservice';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

@Component({
  selector: 'app-manage-cpmonth',
  templateUrl: './manage-cpmonth.component.html',
  styleUrls: ['./manage-cpmonth.component.scss']
})
export class ManageCpmonthComponent implements OnInit {
  calculatorData: any =[];
  id = 1;
  compareIdArray = []
  public getTotalHeight: any;
  public scrolled: any;
  public dataNotFound = false;
  totalPage: any;
  page = 1;
  loader = false;
  spinner = false;
  totalRecords: any;
  public skeletonLoader = false;
  public spinnerLoader = false;
  constructor(
    private router: Router,
    public fakeJson: fakeJson,
    public commonService: CommonService,
    public dialog: MatDialog


  ) { }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.getTotalHeight = window.innerHeight + window.scrollY;
    this.scrolled = $(window).scrollTop()
    if ($(document).height() - $(window).scrollTop() <= $(window).height() + 1) {
      if (this.page !== this.totalPage && this.page >= 1 && this.totalPage && this.calculatorData?.length > 0 && !this.spinner) {
        this.page = this.page + 1;
        // this.dataNotFound = false;
        this.getMoreCalculatorList();
      } else if (this.loader === false) {
        this.dataNotFound = true;
      }
    }
  }

  ngOnInit(): void {
    // this.calculatorData = this.fakeJson.fakeJson();
    this.getCalculatorList()
  }



  getCalculatorList() {
    this.skeletonLoader = true;
    let newParams = { page: this.page, limit: 5, type: 2 };

    let APIparams = {
      uri:this.commonService.getAPIUriFromParams(newParams),
      apiKey: AppSettings.APIsNameArray.TRIPCALCULATOR.LISTCALCULATOR,
    }
    this.commonService.getList(APIparams).subscribe((value) => {
      if (value.success === true) {
        this.calculatorData = value.response;
        this.totalPage = value.totalPages
        this.totalRecords = value.total
        this.skeletonLoader = false;
      } else if (value.success === true) {
        this.skeletonLoader = false;
      }

    }, (error) => {
    })
  }




  getMoreCalculatorList() {
    this.spinner = true;
    this.spinnerLoader = true;
    let uri = null;
    let newParams = { page: this.page, limit: 5, type: 2 };
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.TRIPCALCULATOR.LISTCALCULATOR,
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.spinner = false;
        if (ServerRes.response)
          this.calculatorData = [...this.calculatorData, ...ServerRes.response]
        this.spinnerLoader = false;

        this.totalPage = ServerRes.totalPages
        this.totalRecords = ServerRes.total

      } else if (ServerRes.success === false) {
        this.spinnerLoader = false;

      }
    }, (error) => {
      this.spinner = false
    });
  }


  navigateToEditPage(id: any) {
    this.id = id;
    this.router.navigate(['calculator/manage-cp-month/edit', this.id]);
  }

  addCompareId(id: any, event: any) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked)
      this.compareIdArray.push(id)
    else {
      if (this.compareIdArray.includes(id)) {
        let index = this.compareIdArray.indexOf(id)
        this.compareIdArray.splice(index, 1)
      }
    }


  }

  navigateToCompare() {
    let queryString = this.compareIdArray.join(',');
    this.router.navigate(['/calculator/manage-cp-month/compare-calculator'], { queryParams: { ids: queryString } });

  }



  deletePopup(id: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "460px",
      height:"auto",
      data: { openPop: 'deleteCalculator' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'ok') {
        this.deleteCalculator(id)

      }
    })
  }

  deleteCalculator(id: any) {
    let uri = null;
    let newParams = {
      'id': id,
    }
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: AppSettings.APIsNameArray.TRIPCALCULATOR.DELETECALCULATOR,
      uri: uri,
    };
    this.commonService.delete(APIparams).subscribe((ServerResult) => {
      if (ServerResult.success === true) {
        this.calculatorData = [];
        this.page = 1;
        this.getCalculatorList()
      }
      else {
      }
    });
  }
  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

}
