import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CalculatorComponent } from "./calculator/calculator.component";
import { ManageCPMComponent } from "./manage-cpm/manage-cpm.component";
import { CalculatorMonthComponent } from "./calculator-month/calculator-month.component";
import { ManageCpmonthComponent } from "./manage-cpmonth/manage-cpmonth.component";
import { CompareCalculatorsComponent } from "./compare-calculators/compare-calculators.component";

const routes:Routes = [
    {
        path:'cost-per-miles',
        component:CalculatorComponent
    },
    {
        path:'monthly-cost',
        component:CalculatorMonthComponent
    },
    {
        path:'manage-cp-mile',
        component:ManageCPMComponent
    },
    {
        path:'manage-cp-month',
        component:ManageCpmonthComponent
    },
    {
        path:'calculator/manage-cp-mile/edit/:id',
        component:CalculatorComponent
    },
    {
        path:'calculator/manage-cp-month/edit/:id',
        component:CalculatorMonthComponent
    },
    {
        path:'calculator/manage-cp-mile/compare-calculator',
        component:CompareCalculatorsComponent
    },
    {
        path:'calculator/manage-cp-month/compare-calculator',
        component:CompareCalculatorsComponent
    }

]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]

})

export class calculatorRoutingModule {}