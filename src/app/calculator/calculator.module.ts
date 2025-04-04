import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { calculatorRoutingModule } from "./calculator.routing";
import { CalculatorComponent } from './calculator/calculator.component';
import { ManageCPMComponent } from './manage-cpm/manage-cpm.component';
import { HttpClientModule } from "@angular/common/http";
import { CalculatorMonthComponent } from './calculator-month/calculator-month.component';
import { ManageCpmonthComponent } from './manage-cpmonth/manage-cpmonth.component';
import { CompareCalculatorsComponent } from './compare-calculators/compare-calculators.component';
import { MatTableModule } from "@angular/material/table";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { MaterialModule } from '../material.module';


@NgModule({

 imports: [
    calculatorRoutingModule,
    MatCardModule,
    MatInputModule,
    NgxSkeletonLoaderModule,
    MatExpansionModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    FormsModule ,
    ReactiveFormsModule,
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MaterialModule
 ],
  declarations: [
    CalculatorComponent,
    ManageCPMComponent,
    CalculatorMonthComponent,
    ManageCpmonthComponent,
    CompareCalculatorsComponent
  ]
})

export class CalculatorModule {}