import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { fakeJson } from 'src/app/commons/fakeDataService/fakeservice';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';


@Component({
  selector: 'app-compare-calculators',
  templateUrl: './compare-calculators.component.html',
  styleUrls: ['./compare-calculators.component.scss']
})
export class CompareCalculatorsComponent implements OnInit, AfterViewInit {

  fetchedDataArray = [];
  dataSource: any;
  loader=true;
  displayedColumns: any;
  public ELEMENT_DATA: any[] = [
    { parameters: 'Total Miles', calculator1: '-', calculator2: '-', calculator3: '-' },
    { parameters: 'Total Days', calculator1: '-', calculator2: '-', calculator3: '-' },
    { parameters: 'Truck Average', calculator1: '-', calculator2: '-', calculator3: '-' },
    { parameters: 'Revenue', calculator1: '-', calculator2: '-', calculator3: '-' },
    { parameters: 'Total Trip Cost', calculator1: '-', calculator2: '-', calculator3: '-' },
    { parameters: 'Cost Per Mile', calculator1: '-', calculator2: '-', calculator3: '-' },
  ];

  constructor(
    public router: ActivatedRoute, public jsonService: fakeJson,public commonService:CommonService
  ) { }

  ngOnInit(): void {
    this.displayedColumns = ['parameters', 'calculator1', 'calculator2', 'calculator3'];
    this.dataSource = this.ELEMENT_DATA;
  }

  ngAfterViewInit(): void {
    this.router.queryParamMap.subscribe((value) => {
      let idArray = value['params'].ids.split(',')
      this.fetchData(idArray)
    })
  }

  setTable()
  {
    for (let i = 0; i < this.fetchedDataArray.length; i++) {
      let calculator = [
        this.fetchedDataArray[i].miles ?? '-',
        this.fetchedDataArray[i].days?? '-',
        this.fetchedDataArray[i].truckMileage ??'-',
        this.fetchedDataArray[i].revenueUsd ??'-',
        this.fetchedDataArray[i].expenses.totalTripDataPoints.totalTripCost ??'-',
        this.fetchedDataArray[i].expenses.totalTripDataPoints.perMileCost ??'-',
      ]

      for (let j = 0; j < this.ELEMENT_DATA.length; j++) {
        if (i == 0) { this.ELEMENT_DATA[j].calculator1 = calculator[j] }

        if (i == 1) { this.ELEMENT_DATA[j].calculator2 = calculator[j] }

        if (i == 2 && this.fetchedDataArray.length > 2) {
          this.ELEMENT_DATA[j].calculator3 = calculator[j]
        } else {
          for (let k = 0; k < this.ELEMENT_DATA.length; k++) {
            delete this.ELEMENT_DATA[k].calculator3;
          }
        }
      }
    }

    // Adjust the displayed columns based on fetchedDataArray length
    if (this.fetchedDataArray.length < 3) {
      this.displayedColumns = ['parameters', 'calculator1', 'calculator2'];
    } else {
      this.displayedColumns = ['parameters', 'calculator1', 'calculator2', 'calculator3'];
    }
  }

  fetchData(ids: []) {
    ids.forEach((value, index) => {
      let uri:any;
      let newParams = { id: +value};
      if (newParams){ uri = this.commonService.getAPIUriFromParams(newParams)};
  
      let APIparams={
        uri :uri,
        apiKey:AppSettings.APIsNameArray.TRIPCALCULATOR.LISTCALCULATOR,
      }
      this.commonService.getList(APIparams).subscribe((value)=>{
        this.fetchedDataArray.push(value.response[0])
        if(index==ids.length-1)
          {
            this.setTable()
          }
      }, (error)=>{
        console.log(error)
      })
    })
  
   
  }

  createChart(canvasId: string, chartType: any, labels?,datasets?) {
    this.loader=true;
    setTimeout(() => {
      this.loader=false;
      setTimeout(() => {
        const canvas: any = document.getElementById(canvasId);
      const ctx: any = canvas.getContext("2d");
      // Check if a chart instance already exists for this canvas ID
      if (canvas.chart) {
        // If a chart instance exists, destroy it
        canvas.chart.destroy();
      }
      if (ctx) {
        // Create a new chart instance
        canvas.chart = new Chart(ctx, {
          type: chartType,
          data: {
            labels: labels,
            datasets:datasets
          },
          
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
      
      }, 100);
    }, 1000);
   
  }

  panelOpened(event:string)
  {
    let labels = [];
    if(event=='company')
      {
          labels = ['Permits and Licences', 'Back Office and Miscellaneous Expenses', 'Factoring', 'Legal Services', 'Safety', 'Dispatch'];
          let datasets = [];
          for(let i=0; i<this.fetchedDataArray.length;i++)
            {
              let obj = {
                label: 'Price of '+this.fetchedDataArray[i]?.expenses?.calculatorName,
                data: [
                 this.fetchedDataArray[i].expenses?.companyOfficeExpenses.permits_and_licences.key_value,
                 this.fetchedDataArray[i].expenses?.companyOfficeExpenses.back_office_and_miscellaneous_expenses.key_value,
                 this.fetchedDataArray[i].expenses?.companyOfficeExpenses.factoring.key_value, 
                 this.fetchedDataArray[i].expenses?.companyOfficeExpenses.legal_services.key_value, 
                 this.fetchedDataArray[i].expenses?.companyOfficeExpenses.safety.key_value, 
                 this.fetchedDataArray[i].expenses?.companyOfficeExpenses.dispatch.key_value],
                fill: false,
                borderWidth: 2,
                borderColor: (i==0 ? 'rgb(167, 4, 4)': i==1 ? 'rgb(15, 146, 3)' :'rgb(3, 58, 146)'),
                tension: 0.1,}
                datasets.push(obj)
            }

            this.createChart("myChart1", "line", labels, datasets);
      };
      
    if(event=='truck')
      {
          labels = ['Truck Payment', 'Truck Cleaning', 'Average Fuel price_per_Gallon ', 'Tires', 'Repairs and Maintenance', 'Insurance PaymenttruckExpenses'];
          let datasets = [];
          for(let i=0; i<this.fetchedDataArray.length;i++)
            {
              let obj = {
                label: 'Price of '+this.fetchedDataArray[i]?.expenses?.calculatorName,
                data: [this.fetchedDataArray[i].expenses?.truckExpenses.truck_payment.key_value,
                 this.fetchedDataArray[i].expenses?.truckExpenses.truck_cleaning.key_value,
                 this.fetchedDataArray[i].expenses?.truckExpenses.average_fuel_price.key_value, 
                 this.fetchedDataArray[i].expenses?.truckExpenses.tires.key_value, 
                 this.fetchedDataArray[i].expenses?.truckExpenses.repairs_and_maintenance.key_value, 
                 this.fetchedDataArray[i].expenses?.truckExpenses.insurance_payment.key_value],
                fill: false,
                borderWidth: 2,
                borderColor: (i==0 ? 'rgb(167, 4, 4)': i==1 ? 'rgb(15, 146, 3)' :'rgb(3, 58, 146)'),
                tension: 0.1,}
            datasets.push(obj)
            }

            this.createChart("myChart2", "line", labels, datasets);
      };

      if(event=='trailer')
        {
            labels = ['Trailer Payment', 'ELD', 'Tracking System', 'Lumper Fees', 'Scale fees', 'Insurance Payment','IFTA'];
            let datasets = [];
            for(let i=0; i<this.fetchedDataArray.length;i++)
              {
                let obj = {
                  label: 'Price of '+this.fetchedDataArray[i]?.expenses?.calculatorName,
                  data: [this.fetchedDataArray[i].expenses?.trailerExpenses.trailer_payment.key_value,
                   this.fetchedDataArray[i].expenses?.trailerExpenses.eld.key_value,
                   this.fetchedDataArray[i].expenses?.trailerExpenses.tracking_system.key_value, 
                   this.fetchedDataArray[i].expenses?.trailerExpenses.lumper_fees.key_value, 
                   this.fetchedDataArray[i].expenses?.trailerExpenses.scale_fees.key_value, 
                   this.fetchedDataArray[i].expenses?.trailerExpenses.insurance_payment.key_value,
                   this.fetchedDataArray[i].expenses?.trailerExpenses.ifta.key_value
                  ],
                  fill: false,
                  borderWidth: 2,
                  borderColor: (i==0 ? 'rgb(167, 4, 4)': i==1 ? 'rgb(15, 146, 3)' :'rgb(3, 58, 146)'),
                  tension: 0.1,}
              datasets.push(obj)
              }
  
              this.createChart("myChart3", "line", labels, datasets);
        }

        
      if(event=='driver')
        {
            labels = ['Driver pay', 'Travel Expenses', 'Health Insurance'];
            let datasets = [];
            for(let i=0; i<this.fetchedDataArray.length;i++)
              {
                let obj = {
                  label: 'Price of '+this.fetchedDataArray[i]?.expenses?.calculatorName,
                  data: [this.fetchedDataArray[i].expenses?.driveExpenses.driver_pay.key_value,
                   this.fetchedDataArray[i].expenses?.driveExpenses.travel_expenses.key_value,
                   this.fetchedDataArray[i].expenses?.driveExpenses.health_insurance.key_value, 
                  ],
                  fill: false,
                  borderWidth: 2,
                  borderColor: (i==0 ? 'rgb(167, 4, 4)': i==1 ? 'rgb(15, 146, 3)' :'rgb(3, 58, 146)'),
                  tension: 0.1,}
              datasets.push(obj)
              }
  
              this.createChart("myChart4", "line", labels, datasets);
        };

        if(event=='onroad')
          {
              labels = ['Tolls', 'Deadhead', 'Fines','Unforeseen_Expenses','Phone','Parking'];
              let datasets = [];
              for(let i=0; i<this.fetchedDataArray.length;i++)
                {
                  let obj = {
                    label: 'Price of '+this.fetchedDataArray[i]?.expenses?.calculatorName,
                    data: [this.fetchedDataArray[i].expenses?.onRoadExpenses.tolls.key_value,
                     this.fetchedDataArray[i].expenses?.onRoadExpenses.deadhead.key_value,
                     this.fetchedDataArray[i].expenses?.onRoadExpenses.fines.key_value, 
                     this.fetchedDataArray[i].expenses?.onRoadExpenses.unforeseen_expenses.key_value, 
                     this.fetchedDataArray[i].expenses?.onRoadExpenses.phone.key_value, 
                     this.fetchedDataArray[i].expenses?.onRoadExpenses.parking.key_value, 
                    ],
                    fill: false,
                    borderWidth: 2,
                    borderColor: (i==0 ? 'rgb(167, 4, 4)': i==1 ? 'rgb(15, 146, 3)' :'rgb(3, 58, 146)'),
                    tension: 0.1,}
                datasets.push(obj)
                }
    
                this.createChart("myChart5", "line", labels, datasets);
          };

          if(event=='miscellaneous')
            {
                labels = ['Miscellaneous Losses', 'Other', 'Taxes'];
                let datasets = [];
                for(let i=0; i<this.fetchedDataArray.length;i++)
                  {
                    let obj = {
                      label: 'Price of '+this.fetchedDataArray[i]?.expenses?.calculatorName,
                      data: [this.fetchedDataArray[i].expenses?.miscellaneousExpenses.miscellaneous_fees.key_value,
                       this.fetchedDataArray[i].expenses?.miscellaneousExpenses.other.key_value,
                       this.fetchedDataArray[i].expenses?.miscellaneousExpenses.taxes.key_value, 
                       
                      ],
                      fill: false,
                      borderWidth: 2,
                      borderColor: (i==0 ? 'rgb(167, 4, 4)': i==1 ? 'rgb(15, 146, 3)' :'rgb(3, 58, 146)'),
                      tension: 0.1,}
                  datasets.push(obj)
                  }
      
                  this.createChart("myChart6", "line", labels, datasets);
            }

      }   

      generateFakeSkeleton(count: number): Array<number> {
        const indexes = [];
        for (let i = 0; i < count; i++) {
          indexes.push(i);
        }
        return indexes;
      }
     }
