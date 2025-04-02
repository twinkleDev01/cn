import { NgModule } from "@angular/core";
import { DownloadReportComponent } from "./download-report/download-report.component";
import { FindCarriersComponent } from "./find-carriers/find-carriers.component";
import { FindBrokerDetailsComponent } from "./find-broker-details/find-broker-details.component";
import { FindCarrierDetailsComponent } from "./find-carrier-details/find-carrier-details.component";
import { carrierDataExportsRoutingModule } from "./carrier-data-exports.routing.module";
import { CommonModule, DatePipe } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxLoadingModule } from 'ngx-loading';
import { MaterialModule } from "../material.module";
import { SharedModule } from "../shared/shared.module";
import { FindParkingComponent } from "./find-parking/find-parking.component";

@NgModule({
declarations:[
    DownloadReportComponent,
    FindCarriersComponent,
    FindCarrierDetailsComponent,
    FindBrokerDetailsComponent,
    FindParkingComponent,

    
],
imports:[
    carrierDataExportsRoutingModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule,
    MaterialModule,
    SharedModule

], 
providers:[
    DatePipe
]
})

export class carrierDataExportsModule {}