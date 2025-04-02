import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FindCarriersComponent } from "./find-carriers/find-carriers.component";
import { DownloadReportComponent } from "./download-report/download-report.component";
import { FindCarrierDetailsComponent } from "./find-carrier-details/find-carrier-details.component";
import { FindBrokerDetailsComponent } from "./find-broker-details/find-broker-details.component";
import { FindParkingComponent } from "./find-parking/find-parking.component";

const routes:Routes = [
    {path:'carrier-data-exports/find-carriers', component:FindCarriersComponent},
    {path:'carrier-data-exports/download-report', component:DownloadReportComponent},
    {path:'carrier-data-exports/find-carrier-details', component:FindCarrierDetailsComponent },
    {path:'find-broker', component:FindBrokerDetailsComponent },
    {path:'find-parking', component:FindParkingComponent},
    
]
@NgModule({
 imports:[RouterModule.forChild(routes)],
 exports: [RouterModule]
})

export class carrierDataExportsRoutingModule {}