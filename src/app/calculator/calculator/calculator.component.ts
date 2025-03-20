import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { fakeJson } from 'src/app/commons/fakeDataService/fakeservice';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

interface Expenses {
  calculatorName: string;
  companyOfficeExpenses: Record<string, any>;
  truckExpenses: Record<string, any>;
  trailerExpenses: Record<string, any>;
  driveExpenses: Record<string, any>;
  onRoadExpenses: Record<string, any>;
  miscellaneousExpenses: Record<string, any>;
  totalTripDataPoints: Record<string, any>;
  total: Record<string, any>;
}

interface FormData {
  id?: number;
  truckMileage: number;
  revenueUsd: number;
  miles: number;
  days: number;
  type: number;
  expenses: Expenses;
}

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  isSubmitClicked = false;
  companyOfficeTotal = 0
  truckExpensesTotal = 0
  trailerExpensesTotal = 0
  driverExpensesTotal = 0
  onRoadExpensesTotal = 0
  miscellaneousTotal = 0
  selectedTabIndex=0;
  totalMiles=100;
  revenueAverage=0;
  totalDays = 1
  truckAverage:number = 6;
  companyOfficeInputs = [{name:'Permits and Licences', description:'Permits and licenses fees in a trucking company cover the costs associated with obtaining legal permissions and registrations required for operating commercial trucks, such as operating authority, fuel tax permits, and state/local permits.'},{name:'Back Office and Miscellaneous Expenses', description:'Back office and miscellaneous expenses in a trucking company encompass administrative costs, including office supplies, utilities, and other miscellaneous operational expenses.'},{name:'Factoring',description:'Factoring in trucking refers to a financial service where a company sells its accounts receivable (invoices) to a third party (factor) at a discount in exchange for immediate cash flow.'},{name:'Legal Services',description:'Legal services in trucking cover expenses related to legal consultations, representation, and compliance matters within the industry.'},{name:'Safety',description:'Safety expenses in trucking encompass costs associated with ensuring compliance with safety regulations, conducting training programs, maintaining equipment, and implementing safety measures to protect drivers, cargo, and the public.'},{name:'Dispatch',description:'Dispatch expenses in trucking involve costs related to coordinating and managing truck routes, scheduling, and communicating with drivers and clients to ensure efficient operations.'}]
  truckExpensesInputs = [{name:'Truck Payment',description:"Truck payments in trucking refer to the regular payments made towards financing or leasing the purchase of trucks used in the company's fleet."},{name:'Truck Cleaning',description:'Truck cleaning expenses in a company cover the costs associated with washing, detailing, and maintaining the cleanliness of trucks in the fleet, ensuring a professional appearance and compliance with hygiene standards.'},{name:'Average Fuel price',description:'The average fuel price per gallon in a trucking company includes the cost of fuel plus any applicable fuel taxes, which vary based on factors such as location and type of fuel used.'},{name:'Tires',description:'Tires expense in a trucking company covers the costs of purchasing, maintaining, and replacing tires for the vehicles in the fleet, ensuring safe and efficient operations.'},{name:'Repairs and Maintenance',description:'Repairs and maintenance in a trucking company involve expenses related to servicing, repairing, and upkeep of vehicles and equipment in the fleet to ensure safety, reliability, and compliance with regulations.'},{name:'Insurance Payment',description:'Truck insurance payments in a trucking company refer to the expenses associated with insuring the commercial trucks and vehicles in the fleet against risks such as accidents, theft, and damage.'}]
  trailerExpensesInputs = [{name:'Trailer Payment',description:"Trailer payments in a trucking company pertain to the regular payments made towards financing or leasing the trailers used in the company's fleet for transporting goods."},{name:'ELD',description:"ELD expense in trucking refers to the costs associated with purchasing, installing, and maintaining Electronic Logging Devices (ELDs) in trailers, which are used to track and record drivers' hours of service and ensure compliance with regulatory requirements."},{name:'Tracking System',description:'Tracking system in trailers for a trucking company involves the implementation and maintenance of GPS or telematics technology to monitor the location, status, and performance of trailers in the fleet, optimizing logistics and enhancing operational efficiency.'},{name:'Lumper Fees',description:'Lumper fees in a trucking company are charges incurred for the services of third-party individuals or companies hired to assist with loading or unloading freight at shipping docks or warehouses.'},{name:'Scale fees',description:'Scale fees in a trucking company are charges for using public or private weigh stations to measure the weight of trucks and ensure compliance with legal weight limits and regulations.'},{name:'Insurance Payment',description:'Insurance payment for trailers in a trucking company encompasses the regular payments made to maintain insurance coverage specifically for the trailers in the fleet, protecting against risks such as damage, theft, and liability during transportation.'},{name:'IFTA',description:'The IFTA (International Fuel Tax Agreement) charge in a trucking company refers to the fees and taxes paid to comply with the agreement, which streamlines the reporting and payment of fuel taxes across multiple jurisdictions for interstate carriers. This charge ensures that trucking companies fulfill their tax obligations for the fuel consumed while operating in different states or provinces.'}]
  driverExpensesInputs = [{name:'Driver pay',description:'Driver pay in a trucking company refers to the compensation provided to truck drivers for their services, typically based on factors such as miles driven, hours worked, or the type of freight transported.'},{name:'Travel Expenses',description:'Travel expenses in a trucking company include costs associated with accommodations (such as hotel stays), meals, showers, and other necessities incurred by drivers while on the road for work-related travel.'},{name:'Health Insurance',description:'Health insurance in a trucking company refers to the coverage provided to employees, including drivers, for medical expenses and healthcare services, helping to safeguard their well-being and manage healthcare costs.'}]
  onRoadExpensesInputs = [{name:'Tolls',description:'Tolls charges in a trucking company represent fees paid for the use of toll roads, bridges, tunnels, or other infrastructure during transportation operations, facilitating efficient travel routes and logistics.'},{name:'Deadhead',description:'Deadhead charges in a trucking company refer to the costs incurred when a truck travels empty (without cargo) between two destinations, typically resulting in lost revenue for the company due to unproductive miles.'},{name:'Fines',description:'Fines in a trucking company represent penalties or monetary sanctions imposed for violations of traffic regulations, safety standards, or compliance requirements, which can result in financial losses and regulatory repercussions for the company.'},{name:'Unforeseen Expenses',description:'Unforeseen expenses in a trucking company are unexpected costs that arise due to unforeseen circumstances, emergencies, or operational challenges, requiring additional financial resources beyond the usual budgeted expenses.'},{name:'Phone',description:'Phone expense in a trucking company covers the costs associated with communication services, such as mobile phones or landlines, used for operational purposes, coordination with drivers, and client communication.'},{name:'Parking',description:'Parking expenses in a trucking company refer to the costs incurred for parking trucks or vehicles at designated facilities, rest areas, truck stops, or terminals during transit, layovers, or overnight stays.'}]
  miscellaneousInputs = [{name:'Miscellaneous Fees',description:'Miscellaneous fees/losses in a trucking company encompass various unexpected or incidental expenses, losses, or charges that do not fall under specific categories, such as lost cargo, damaged goods, or unforeseen operational costs.'},{name:'other',description:'In this expenses you can mention amount which you incure for anything else which is not mention in default options.'},{name:'Taxes',description:'Taxes in a trucking company include various types of taxes such as income tax, fuel tax, property tax, and sales tax, among others, which the company is required to pay to government authorities based on its earnings, assets, and transactions.'}]
  companyOfficeForm: FormGroup;
  trailerExpenseForm: FormGroup;
  truckExpensesForm: FormGroup;
  driverExpenseForm:FormGroup;
  onRoadExpenseForm:FormGroup;
  miscellaneousForm:FormGroup;
  totalTripCost:any;
  perMileCost:any;
  calculatorData=[]
  isEditPage = false;
  calculatorId:any;

 
 
    
    constructor(private alertService: AlertService, private cd: ChangeDetectorRef,public commonService:CommonService,private formBuilder: FormBuilder, public activeRouter:ActivatedRoute,public router:Router, public jsonService:fakeJson, public dialog: MatDialog) { }
  

  ngOnInit(): void {
      this.createForm();
  }

  ngAfterViewInit() {
    this.activeRouter.snapshot.children
    if(this.activeRouter?.snapshot.url[2]?.path=='edit')
      {
        this.isEditPage = true;
        this.calculatorId=this.activeRouter.snapshot.params.id
        this.fetchAndFillData(this.activeRouter.snapshot.params.id)
      }
      else 
      {
        this.isEditPage = false;
      }
      this.cd.detectChanges();
  }

  createForm() {
    //create form for all the section here one by one 
    this.companyOfficeForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });  

    this.truckExpensesForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });  

    this.trailerExpenseForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    }); 

    this.driverExpenseForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    }); 

    this.onRoadExpenseForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });

    this.miscellaneousForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });


    for (let i = 0; i < this.companyOfficeInputs.length; i++) {
      this.addItem('companyOffice');
    }
    for (let i = 0; i < this.truckExpensesInputs.length; i++) {
      this.addItem('truckExpenses');
    }
    for (let i = 0; i < this.trailerExpensesInputs.length; i++) {
      this.addItem('trailerExpenses');
    }
    for (let i = 0; i < this.driverExpensesInputs.length; i++) {
      this.addItem('driverExpenses');
    }
    for (let i = 0; i < this.onRoadExpensesInputs.length; i++) {
      this.addItem('onRoadExpenses');
    }
    for (let i = 0; i < this.miscellaneousInputs.length; i++) {
      this.addItem('miscellaneousExpenses');
    }
  }


  addItem(type:string) {
    let  items;
    if(type =='companyOffice')
   { items = this.companyOfficeForm.get('items') as FormArray}
    else if(type =='truckExpenses')
    { items = this.truckExpensesForm.get('items') as FormArray}
    else if(type =='trailerExpenses')
      { items = this.trailerExpenseForm.get('items') as FormArray}
    else if(type =='driverExpenses')
      { items = this.driverExpenseForm.get('items') as FormArray}
    else if(type =='onRoadExpenses')
      { items = this.onRoadExpenseForm.get('items') as FormArray}
    else if(type =='miscellaneousExpenses')
      { items = this.miscellaneousForm.get('items') as FormArray}
    items.push(this.createItemControl());
  }

  createItemControl(): FormGroup {
    return this.formBuilder.group({
      amount: ['',[Validators.pattern(/^[.\d]+$/)]],
      unit: ['trip'],
      perMile: [''],
      perTrip: ['']
    });
  }
 

  fetchAndFillData(id:any)
  {
    let uri:any;
    let newParams = { id: id};
    if (newParams){ uri = this.commonService.getAPIUriFromParams(newParams)};

    let APIparams={
      uri :uri,
      apiKey:AppSettings.APIsNameArray.TRIPCALCULATOR.LISTCALCULATOR,
    }
    this.commonService.getList(APIparams).subscribe((value)=>{
      this.calculatorData = value.response.filter((data: any) => data.type == 1)
      this.truckAverage=+this.calculatorData[0].truckMileage
      this.revenueAverage=+this.calculatorData[0].revenueUsd
      this.totalDays=+this.calculatorData[0].days
      this.totalMiles=+this.calculatorData[0].miles
      this.prefillFormFromJson(this.calculatorData[0])
    }, (error)=>{
    })
  }

  prefillFormFromJson(jsonData: any) {
    this.prefillSection('companyOfficeInputs','companyOfficeForm', jsonData.expenses.companyOfficeExpenses, this.companyOfficeForm);
    this.prefillSection('truckExpensesInputs', 'truckExpensesForm',jsonData.expenses.truckExpenses, this.truckExpensesForm);
    this.prefillSection('trailerExpensesInputs','trailerExpenseForm', jsonData.expenses.trailerExpenses, this.trailerExpenseForm);
    this.prefillSection('driverExpensesInputs', 'driverExpenseForm',jsonData.expenses.driveExpenses, this.driverExpenseForm);
    this.prefillSection('onRoadExpensesInputs','onRoadExpenseForm', jsonData.expenses.onRoadExpenses, this.onRoadExpenseForm);
    this.prefillSection('miscellaneousInputs', 'miscellaneousForm',jsonData.expenses.miscellaneousExpenses, this.miscellaneousForm);
  }
  
  prefillSection(sectionName: string,formName:string, data: any[], formGroup: FormGroup) {
    const itemsArray = formGroup.get('items') as FormArray;
    itemsArray.clear(); // Clear existing items
  Object.keys(data)?.forEach(key => {
    const itemData = data[key];
    this.manageTitleInputsArray(sectionName,itemData.is_default,itemData.key_name)
    const itemControl = this.formBuilder.group({
      amount: [itemData.key_value, [Validators.pattern(/^[.\d]+$/)]],
      unit: [itemData.keyunit],
      perMile: [''],
      perTrip: ['']
    });

    itemsArray.push(itemControl);
  });
  for(let i=0;i<Object.keys(data).length;i++)
    {
    this.onAmountInput(i,formName,itemsArray)
    }
  }

  //this is to add title in array coming from json
  manageTitleInputsArray(inputType, is_default, name)
  {
    if(inputType=='companyOfficeInputs' && !is_default)
      {
       
        if(!is_default)
        this.companyOfficeInputs.push({name:name,description:''})
      }
    else if(inputType=='truckExpensesInputs' && !is_default)
      {
        this.truckExpensesInputs.push({name:name,description:''})
      }
      else if(inputType=='trailerExpensesInputs' && !is_default)
        {
          this.trailerExpensesInputs.push({name:name,description:''})
        }
        else if(inputType=='driverExpensesInputs' && !is_default)
          {
            this.driverExpensesInputs.push({name:name,description:''})
          }
          else if(inputType=='onRoadExpensesInputs' && !is_default)
            {
              this.onRoadExpensesInputs.push({name:name,description:''})
            }
            else if(inputType=='miscellaneousInputs' && !is_default)
              {
                this.miscellaneousInputs.push({name:name,description:''})
              }
  }
  
  get companyOfficeControls() {
    return (this.companyOfficeForm.get('items') as FormArray).controls;
  }

  get truckExpensesControls() {
    return (this.truckExpensesForm.get('items') as FormArray).controls;
  }

  get trailerControls() {
    return (this.trailerExpenseForm.get('items') as FormArray).controls;
  }

  get driverControls() {
    return (this.driverExpenseForm.get('items') as FormArray).controls;
  }

  get onRoadControls() {
    return (this.onRoadExpenseForm.get('items') as FormArray).controls;
  }

  get miscellaneousControls() {
    return (this.miscellaneousForm.get('items') as FormArray).controls;
  }

 
  removeItem(index: number, arrayName:string, form:string) {
    let  items;
    if(form =='companyOffice')
   { items = this.companyOfficeForm.get('items') as FormArray}
    else if(form =='truckExpenses')
    { items = this.truckExpensesForm.get('items') as FormArray}
    else if(form =='trailerExpenses')
      { items = this.trailerExpenseForm.get('items') as FormArray}
    else if(form =='driverExpenses')
      { items = this.driverExpenseForm.get('items') as FormArray}
    else if(form =='onRoadExpenses')
      { items = this.onRoadExpenseForm.get('items') as FormArray}
    else if(form =='miscellaneousExpenses')
      { items = this.miscellaneousForm.get('items') as FormArray}

    items.removeAt(index);
    if(arrayName == 'companyOfficeInputs')
      {
        this.companyOfficeInputs.splice(index,1);
        this.companyOfficeTotal= 0
        this.companyOfficeForm.value.items.forEach(element => {
          this.companyOfficeTotal = this.companyOfficeTotal + +element.perTrip;
      });
      }
      if(arrayName == 'truckExpensesInputs')
        {
          this.truckExpensesInputs.splice(index,1);
          this.truckExpensesTotal= 0
          this.truckExpensesForm.value.items.forEach(element => {
            this.truckExpensesTotal = this.truckExpensesTotal + +element.perTrip;
        });
        }
        if(arrayName == 'trailerExpensesInputs')
          {
            this.trailerExpensesInputs.splice(index,1);
            this.trailerExpensesTotal= 0
            this.trailerExpenseForm.value.items.forEach(element => {
              this.trailerExpensesTotal = this.trailerExpensesTotal + +element.perTrip;
          });
          }
       if(arrayName == 'driverExpensesInputs')
            {
              this.driverExpensesInputs.splice(index,1);
              this.driverExpensesTotal= 0
              this.driverExpenseForm.value.items.forEach(element => {
                this.driverExpensesTotal = this.driverExpensesTotal + +element.perTrip;
            });
            }
        if(arrayName == 'onRoadExpensesInputs')
              {
                this.onRoadExpensesInputs.splice(index,1);
                this.onRoadExpensesTotal= 0
                this.onRoadExpenseForm.value.items.forEach(element => {
                  this.onRoadExpensesTotal = this.onRoadExpensesTotal + +element.perTrip;
              });
              }
       if(arrayName == 'miscellaneousInputs')
                {
                  this.miscellaneousInputs.splice(index,1);
                  this.miscellaneousTotal= 0
                  this.miscellaneousForm.value.items.forEach(element => {
                    this.miscellaneousTotal = this.miscellaneousTotal + +element.perTrip;
                });
                }
    
  }



  ////Top four values . 
  onInputValue(type:string)
  {
    this.companyOfficeTotal =0
    this.truckExpensesTotal=0;
    this.trailerExpensesTotal=0
    this.driverExpensesTotal=0;
    this.onRoadExpensesTotal=0;
    this.miscellaneousTotal=0;
   
  {  const items = this.companyOfficeForm.get('items') as FormArray;
    this.companyOfficeForm.value.items.forEach((element, index) => {
  
      if(element.unit == 'mile' || element.unit == 'day')
    {
      const item = items.at(index) as FormGroup;
      if(item?.get('amount').value)
      {
      let newPerTripValue = +this.unitCondition(element.unit)?.toFixed(2)*item?.get('amount').value;
      item?.get('perTrip').setValue(newPerTripValue);
      let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
      item?.get('perMile').setValue(newPerMileValue);
      this.companyOfficeTotal = this.companyOfficeTotal + +item?.get('perTrip').value;
    }
  }
  else   {
    const item = items.at(index) as FormGroup;
    let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
    item?.get('perMile').setValue(newPerMileValue);
    this.companyOfficeTotal = this.companyOfficeTotal + +item?.get('perTrip').value;
  }
  });}

  {  const items = this.truckExpensesForm.get('items') as FormArray;
    this.truckExpensesForm.value.items.forEach((element, index) => {
          
      if(element.unit == 'mile' || element.unit == 'day')
    {
      const item = items.at(index) as FormGroup;
     
      if(item?.get('amount').value)
      {
       
      let newPerTripValue = +this.unitCondition(element.unit)?.toFixed(2)*item?.get('amount').value;
      item?.get('perTrip').setValue(newPerTripValue);
      let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
      item?.get('perMile').setValue(newPerMileValue);
      this.truckExpensesTotal = this.truckExpensesTotal + +item?.get('perTrip').value;
    }}
    else 
    {
      
      const item = items.at(index) as FormGroup;
     
      let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
      item?.get('perMile').setValue(newPerMileValue);
    
      this.truckExpensesTotal = this.truckExpensesTotal + +item?.get('perTrip').value;
      if(index==2)
        {
          this.calculatePerMileTrip(index,item?.get('amount').value,'trip','truckExpensesForm')
        }
    }
  });}

  {  const items = this.trailerExpenseForm.get('items') as FormArray;
  this.trailerExpenseForm.value.items.forEach((element, index) => {
    
    if(element.unit == 'mile' || element.unit == 'day')
  {
    const item = items.at(index) as FormGroup;
   
    if(item?.get('amount').value)
    {
    let newPerTripValue = +this.unitCondition(element.unit)?.toFixed(2)*item?.get('amount').value;
    item?.get('perTrip').setValue(newPerTripValue);
    let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
    item?.get('perMile').setValue(newPerMileValue);
    this.trailerExpensesTotal = this.trailerExpensesTotal + +item?.get('perTrip').value;
  }}
  else {
    const item = items.at(index) as FormGroup;
    let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
    item?.get('perMile').setValue(newPerMileValue);
    this.trailerExpensesTotal = this.trailerExpensesTotal + +item?.get('perTrip').value;
  }
});}

{  const items = this.driverExpenseForm.get('items') as FormArray;
this.driverExpenseForm.value.items.forEach((element, index) => {
 
  
  if(element.unit == 'mile' || element.unit == 'day')
{
  const item = items.at(index) as FormGroup;
 
  if(item?.get('amount').value)
  {
  let newPerTripValue = +this.unitCondition(element.unit)?.toFixed(2)*item?.get('amount').value;
  item?.get('perTrip').setValue(newPerTripValue);
  let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
  item?.get('perMile').setValue(newPerMileValue);
  this.driverExpensesTotal = this.driverExpensesTotal + +item?.get('perTrip').value;
}}
else 
{
  const item = items.at(index) as FormGroup;
  let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
  item?.get('perMile').setValue(newPerMileValue);
  this.driverExpensesTotal = this.driverExpensesTotal + +item?.get('perTrip').value;
}
});}

{  const items = this.onRoadExpenseForm.get('items') as FormArray;
this.onRoadExpenseForm.value.items.forEach((element, index) => {
 
  if(element.unit == 'mile' || element.unit == 'day')
{
  const item = items.at(index) as FormGroup;
 
  if(item?.get('amount').value)
  {
  let newPerTripValue = +this.unitCondition(element.unit)?.toFixed(2)*item?.get('amount').value;
  item?.get('perTrip').setValue(newPerTripValue);
  let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
  item?.get('perMile').setValue(newPerMileValue);
  this.onRoadExpensesTotal = this.onRoadExpensesTotal + +item?.get('perTrip').value;
}}
else  {
  const item = items.at(index) as FormGroup;
  let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
  item?.get('perMile').setValue(newPerMileValue);
  this.onRoadExpensesTotal = this.onRoadExpensesTotal + +item?.get('perTrip').value;
}
});}

{  const items = this.miscellaneousForm.get('items') as FormArray;
this.miscellaneousForm.value.items.forEach((element, index) => {
 
  if(element.unit == 'mile' || element.unit == 'day')
{
  const item = items.at(index) as FormGroup;
 
  if(item?.get('amount').value)
  {
  let newPerTripValue = +this.unitCondition(element.unit)?.toFixed(2)*item?.get('amount').value;
  item?.get('perTrip').setValue(newPerTripValue);
  let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
  item?.get('perMile').setValue(newPerMileValue);
  this.miscellaneousTotal = this.miscellaneousTotal + +item?.get('perTrip').value;
}}
else  {
  const item = items.at(index) as FormGroup;
  let newPerMileValue = +(item?.get('perTrip').value/this.totalMiles).toFixed(2)
  item?.get('perMile').setValue(newPerMileValue);
  this.miscellaneousTotal = this.miscellaneousTotal + +item?.get('perTrip').value;
}
});}

  }

  unitCondition(value)
  {
    if(value == 'mile')
      {
        return this.totalMiles
      }
      else if (value == 'trip')
        {
          return 1
        }
        else if (value == 'day')
          {
            return this.totalDays
          }
          else if (value == 'month')
            {
              return 1/30*this.totalDays;
            }
            else if (value =='year')
              {
                return 1/365*this.totalDays
              }
  }



  onExpenseInput(itemIndex,arrayName,value)
  {
      // Subscribe to changes in the 'amount' field
    arrayName[itemIndex]={name:value,description:''}
  }


  //on inputing amount
  onAmountInput(itemIndex,form,fetchForm?)
  {
    let items
    if(form == 'companyOfficeForm')
    { 
      if(fetchForm)
        {
          items=fetchForm;
        }
        else 
        {
          items = this.companyOfficeForm.get('items') as FormArray;
        }

    }
    if(form == 'truckExpensesForm')
      {
        if(fetchForm)
          {
            items=fetchForm;
          }
          else 
        { items = this.truckExpensesForm.get('items') as FormArray;}
      }
    if(form == 'trailerExpenseForm')
       {
        if(fetchForm)
          {
            items=fetchForm;
          }
          else 
         { items = this.trailerExpenseForm.get('items') as FormArray;}
        }
   if(form == 'driverExpenseForm')
       {
        if(fetchForm)
          {
            items=fetchForm;
          }
          else 
          {items = this.driverExpenseForm.get('items') as FormArray;}
       }
  if(form == 'onRoadExpenseForm')
        {
          if(fetchForm)
            {
              items=fetchForm;
            }
            else 
           { items = this.onRoadExpenseForm.get('items') as FormArray;}
        }
   if(form == 'miscellaneousForm')
       {
        if(fetchForm)
          {
            items=fetchForm;
          }
          else 
          { items = this.miscellaneousForm.get('items') as FormArray;}
       }

      //  if amount is selected unit is required 
    const item = items.at(itemIndex) as FormGroup;
      if (item?.get('amount').value) {
        item?.get('unit').setValidators([Validators.required]);
        if(item?.get('unit').value)
          {
            this.onUnitSelection(itemIndex,{value:item?.get('unit').value},{value:{amount:item?.get('amount').value}},form)
          }
      } else {
        // Remove required validation from 'unit' field
        item?.get('unit').disable;
        item?.get('unit').clearValidators();
        if(item?.get('unit').value)
          {
            this.onUnitSelection(itemIndex,{value:item?.get('unit').value},{value:{amount:item?.get('amount').value}},form)
          }
      }
      // Update validation status
      item?.get('unit').updateValueAndValidity();
  }

  onUnitSelection(itemIndex: number, value:any, itemform, form)
  {
    let items
    if(form=='companyOfficeForm')
     {items = this.companyOfficeForm.get('items') as FormArray;}
    if(form=='truckExpensesForm')
      {items = this.truckExpensesForm.get('items') as FormArray;}
    if(form=='trailerExpenseForm')
      {items = this.trailerExpenseForm.get('items') as FormArray;}
    if(form=='driverExpenseForm')
      {items = this.driverExpenseForm.get('items') as FormArray;}
    if(form=='onRoadExpenseForm')
      {items = this.onRoadExpenseForm.get('items') as FormArray;}
    if(form=='miscellaneousForm')
      {items = this.miscellaneousForm.get('items') as FormArray;}
    const item = items.at(itemIndex) as FormGroup;
    this.calculatePerMileTrip(itemIndex,itemform.value.amount,value,form)
  }

  
  calculatePerMileTrip(i,amount,unit,form)
  {
   if(unit)
   { 
    let perTripValue = +(this.unitCondition(unit.value)*amount).toFixed(2); 
    let perMileValue = +(perTripValue/this.totalMiles).toFixed(2)
    this.setPerValuesPerTrip(i, perMileValue, perTripValue, form) 
}
if( unit && form=='truckExpensesForm' && i==2)
  {
    let perTripValue = +amount*(this.totalMiles/this.truckAverage)
    let perMileValue = +(perTripValue/this.totalMiles).toFixed(2)
    this.setPerValuesPerTrip(i, perMileValue, perTripValue, form) 
  }
  }

  setPerValuesPerTrip(itemIndex: number, perMileValue: number, perTripValue: number, form) {
    let items
    if(form=='companyOfficeForm')
     {items = this.companyOfficeForm.get('items') as FormArray;}
    if(form=='truckExpensesForm')
      {items = this.truckExpensesForm.get('items') as FormArray;}
    if(form=='trailerExpenseForm')
      {items = this.trailerExpenseForm.get('items') as FormArray;}
    if(form=='driverExpenseForm')
      {items = this.driverExpenseForm.get('items') as FormArray;}
    if(form=='onRoadExpenseForm')
      {items = this.onRoadExpenseForm.get('items') as FormArray;}
    if(form=='miscellaneousForm')
      {items = this.miscellaneousForm.get('items') as FormArray;}
    const item = items.at(itemIndex) as FormGroup;
    item?.get('perMile').setValue(perMileValue);
    item?.get('perTrip').setValue(perTripValue);
    this.companyOfficeTotal = 0;
    this.truckExpensesTotal=0;
    this.trailerExpensesTotal=0;
    this.driverExpensesTotal=0;
    this.onRoadExpensesTotal=0;
    this.miscellaneousTotal=0;
    this.companyOfficeForm.value.items.forEach(element => {
        this.companyOfficeTotal = this.companyOfficeTotal + (isNaN(element.perTrip) ? 0 : +element.perTrip);
    });
    this.truckExpensesForm.value.items.forEach(element => {
      this.truckExpensesTotal = this.truckExpensesTotal + (isNaN(element.perTrip) ? 0 : +element.perTrip);
  });
  this.trailerExpenseForm.value.items.forEach(element => {
    this.trailerExpensesTotal = this.trailerExpensesTotal + (isNaN(element.perTrip) ? 0 : +element.perTrip);
});
this.driverExpenseForm.value.items.forEach(element => {
  this.driverExpensesTotal = this.driverExpensesTotal + (isNaN(element.perTrip) ? 0 : +element.perTrip);
});
this.onRoadExpenseForm.value.items.forEach(element => {
  this.onRoadExpensesTotal = this.onRoadExpensesTotal + (isNaN(element.perTrip) ? 0 : +element.perTrip);
});
this.miscellaneousForm.value.items.forEach(element => {
  this.miscellaneousTotal = this.miscellaneousTotal + (isNaN(element.perTrip) ? 0 : +element.perTrip);
});
     
  }


  onSubmit() {
    this.isSubmitClicked = true;
    if (this.selectedTabIndex == 1) {
        this.createChart("myChart", "bar");
    } else if (this.selectedTabIndex == 2) {
        this.createChart("myChart2", "pie");
    }
}

payloadOfAllData()
{
  let allFormsData:FormData = {
    truckMileage: this.truckAverage,
    revenueUsd: this.revenueAverage,
    miles:this.totalMiles,
    days: this.totalDays,
    type: 1,
    expenses:{
      calculatorName:'',
      companyOfficeExpenses: {},
      truckExpenses: {},
      trailerExpenses: {},
      driveExpenses: {},
      onRoadExpenses: {},
      miscellaneousExpenses: {},
      totalTripDataPoints:{},
      total:{}
    }
   
};

for (let i = 0; i < this.companyOfficeInputs.length; i++) {
    let key = this.companyOfficeInputs[i].name.toLowerCase().replace(/ /g, "_");
    allFormsData.expenses.companyOfficeExpenses[key] = {
        key_name: this.companyOfficeInputs[i].name,
        key_value: this.companyOfficeForm.value.items[i].amount,
        keyunit: this.companyOfficeForm.value.items[i].unit,
        is_default: (i <= 5 ? true : false)
    };
}

for (let i = 0; i < this.truckExpensesInputs.length; i++) {
    let key = this.truckExpensesInputs[i].name.toLowerCase().replace(/ /g, "_");
    allFormsData.expenses.truckExpenses[key] = {
        key_name: this.truckExpensesInputs[i].name,
        key_value: this.truckExpensesForm.value.items[i].amount,
        keyunit: this.truckExpensesForm.value.items[i].unit,
        is_default: (i <= 5 ? true : false)
    };
}

for (let i = 0; i < this.trailerExpensesInputs.length; i++) {
    let key = this.trailerExpensesInputs[i].name.toLowerCase().replace(/ /g, "_");
    allFormsData.expenses.trailerExpenses[key] = {
        key_name: this.trailerExpensesInputs[i].name,
        key_value: this.trailerExpenseForm.value.items[i].amount,
        keyunit: this.trailerExpenseForm.value.items[i].unit,
        is_default: (i <= 6 ? true : false)
    };
}

for (let i = 0; i < this.driverExpensesInputs.length; i++) {
    let key = this.driverExpensesInputs[i].name.toLowerCase().replace(/ /g, "_");
    allFormsData.expenses.driveExpenses[key] = {
        key_name: this.driverExpensesInputs[i].name,
        key_value: this.driverExpenseForm.value.items[i].amount,
        keyunit: this.driverExpenseForm.value.items[i].unit,
        is_default: (i <= 2 ? true : false)
    };
}

for (let i = 0; i < this.onRoadExpensesInputs.length; i++) {
    let key = this.onRoadExpensesInputs[i].name.toLowerCase().replace(/ /g, "_");
    allFormsData.expenses.onRoadExpenses[key] = {
        key_name: this.onRoadExpensesInputs[i].name,
        key_value: this.onRoadExpenseForm.value.items[i].amount,
        keyunit: this.onRoadExpenseForm.value.items[i].unit,
        is_default: (i <= 5 ? true : false)
    };
}

for (let i = 0; i < this.miscellaneousInputs.length; i++) {
    let key = this.miscellaneousInputs[i].name.toLowerCase().replace(/ /g, "_");
    allFormsData.expenses.miscellaneousExpenses[key] = {
        key_name: this.miscellaneousInputs[i].name,
        key_value: this.miscellaneousForm.value.items[i].amount,
        keyunit: this.miscellaneousForm.value.items[i].unit,
        is_default: (i <= 2 ? true : false)
    };
}

allFormsData.expenses.totalTripDataPoints={
  totalTripCost : this.companyOfficeTotal,
  perMileCost : this.truckExpensesTotal,
}
allFormsData.expenses.total={
  companyOfficeTotal : this.companyOfficeTotal,
  truckExpensesTotal : this.truckExpensesTotal,
  trailerExpensesTotal : this.trailerExpensesTotal,
  driverExpensesTotal : this.driverExpensesTotal,
  onRoadExpensesTotal :this.onRoadExpensesTotal,
  miscellaneousTotal : this.miscellaneousTotal
}


return allFormsData;
}
  
  createChart(canvasId: string, chartType: any) {
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
          labels: ['Company & Office Expenses', 'Truck Expenses', 'Trailer Expenses', 'Drive Expenses', 'On Road Expenses', 'Miscellaneous and Other'],
          datasets: [{
            label: 'Price of Various Expenses in $',
            data: [this.companyOfficeTotal, this.truckExpensesTotal, this.trailerExpensesTotal, this.driverExpensesTotal, this.onRoadExpensesTotal, this.miscellaneousTotal],
            borderWidth: 10,
            backgroundColor: [
              'rgba(255, 99, 132)',
              'rgba(255, 159, 64)',
              'rgba(255, 205, 86)',
              'rgba(75, 192, 192)',
              'rgba(54, 162, 235)',
              'rgba(153, 102, 255)',
              'rgba(201, 203, 207)'
            ],
          }]
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
    }, 1000);
    
  }
  

  tabChangeEvent(event:any)
  {
    this.selectedTabIndex = event.index
    if(event.index == 1)
      {
        
        this.createChart("myChart", "bar");
      }
    if (event.index == 2)
      {
          this.createChart("myChart2", "doughnut");
      }

  }

  overallTotal(type)
  {
    this.totalTripCost = this.companyOfficeTotal+this.truckExpensesTotal+this.trailerExpensesTotal+this.driverExpensesTotal+this.miscellaneousTotal+this.onRoadExpensesTotal;

    if(type=='trip')
      {
        return this.totalTripCost?.toFixed(2);
      }
      if(type =='mile')
        {
          this.perMileCost=this.totalMiles ? (this.totalTripCost/this.totalMiles):'-'
          return this.perMileCost?.toFixed(2)
        }
  }

  onSave()
  {
    if(localStorage.getItem('login_type') == 'after_login'){
    const dialogRef=this.dialog.open(PopupComponent,{
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "670px",
      height:"auto",
      data: { openPop: 'calculatorName' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === "ok") {
        let payload = this.payloadOfAllData()
        payload.expenses.calculatorName = result.value
        this.postCalculator(payload)
      }
    });
  }else{
    const dialogRef=this.dialog.open(PopupComponent,{
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: "520px",
      height:"auto",
      data: { openPop: 'beforLoginCalculator' },
    });
  }
  }

  postCalculator(data:any)
    { 
    

      let APIparams = {
        apiKey: AppSettings.APIsNameArray.TRIPCALCULATOR.CREATECALCULATOR,
        uri: '',
        postBody:data
      };
      this.commonService.post(APIparams).subscribe((value)=>{
        if (value.success === true) {
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Calculator Update',
            value.message
          );
        } else if (value.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'check_circle',
            'Calculator Update',
            value.message
          );
        }
       this.router.navigate(['./calculator/manage-cp-mile'])
      })
    }

    onUpdate()
    {
      const dialogRef=this.dialog.open(PopupComponent,{
        disableClose: true,
        backdropClass: 'cn_custom_popup',
        width: "670px",
        height:"auto",
        data: { openPop: 'calculatorNameUpdate', loadData: this.calculatorData[0].expenses.calculatorName},
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event === "ok") {
          let payload = this.payloadOfAllData()
          payload.expenses.calculatorName = result.value
          payload.id=+this.calculatorId
          this.updateCalculator(payload)
        }
      });
 
    }

    updateCalculator(data:any)
    { 
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.TRIPCALCULATOR.UPDATECALCULATOR,
        uri: '',
        postBody:data
      };
      this.commonService.post(APIparams).subscribe((value)=>{
        this.fetchAndFillData(this.calculatorId)
        if (value.success === true) {
          this.alertService.showNotificationMessage(
            'success',
            'bottom',
            'left',
            'txt_s',
            'check_circle',
            'Calculator Update',
            value.message
          );
        } else if (value.success === false) {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_d',
            'check_circle',
            'Calculator Update',
            value.message
          );
        }
       this.router.navigate(['./calculator/manage-cp-mile'])

      })
    }

   
}



