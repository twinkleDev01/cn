import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/commons/guard/auth.guard";
import { GoogleAnalyticsCodeComponenet } from "./carrier-Component/google-analytics-code/google-analytics-code.component";
import { SocialMediaComponenet } from "./carrier-Component/social-media/social-media.componenet";
import { SEOComponent } from "./carrier-Component/seo/seo.component";

const routes: Routes = [
    { path: 'digital-marketing/seo', component: SEOComponent, canActivate : [AuthGuard] },
    { path: 'digital-marketing/analytics', component: GoogleAnalyticsCodeComponenet, canActivate : [AuthGuard] },
    { path: 'digital-marketing/social-media', component: SocialMediaComponenet, canActivate : [AuthGuard] },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class digitalMarketingRoutingModule { 

}
