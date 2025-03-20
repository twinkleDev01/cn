import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../commons/guard/auth.guard';
import { InviteReviewComponent } from './carrier-component/invite-review/invite-review.component';
import { ManageReviewComponent } from './carrier-component/manage-review/manage-review.component';
import { AiInviteReviewComponent } from './carrier-component/ai-invite-review/ai-invite-review.component';
import { AiRespondReviewComponent } from './carrier-component/ai-respond-review/ai-respond-review.component';
import { AddReviewNewComponent } from './non-carrier-component/add-review-new/add-review-new.component';
import { NonCarrierManageReviewComponent } from './non-carrier-component/non-carrier-manage-review/non-carrier-manage-review.component';
import { WriteReviewComponent } from './non-carrier-component/write-a-review/write-a-review.component';
import { NonCarrierNewEditReviewComponent } from './non-carrier-component/non-carrier-new-edit-review/non-carrier-new-edit-review.component';
import { PendingReviewInvitationComponent } from './carrier-component/panding-review-invitation/pending-review-invitation.component';
import { ReviewInvitationComponent } from './non-carrier-component/review-Invitation/review-invitation.component';
import { AddReviewBrokerComponent } from './add-review-broker/add-review-broker.component';
import { EditReviewBroker } from './edit-review-broker/edit-review-broker.component';

const routes: Routes = [
  { path: 'invite-for-review', component: InviteReviewComponent, canActivate : [AuthGuard] },
  { path: 'manage-my-reviews', component: ManageReviewComponent, canActivate: [AuthGuard] },
  { path: 'invite-for-review/invite', component: AiInviteReviewComponent, canActivate: [AuthGuard] },
  { path: 'manage-my-reviews/respond/:Id', component: AiRespondReviewComponent, canActivate: [AuthGuard] },
  { path: 'write-a-review-for-carrier', component: AddReviewNewComponent, canActivate: [AuthGuard] },
  { path: 'write-a-review-for-broker', component: AddReviewBrokerComponent, canActivate: [AuthGuard] },
  { path: 'edit-a-review-for-carrier/:Id', component: NonCarrierNewEditReviewComponent, canActivate: [AuthGuard] },{ path: 'edit-a-review-for-broker/:Id', component: EditReviewBroker, canActivate: [AuthGuard] },
  { path: 'non-carrier-manage-reviews', component: NonCarrierManageReviewComponent, canActivate: [AuthGuard] },
  { path: 'write-a-review', component: WriteReviewComponent, canActivate: [AuthGuard] },
  { path: 'pending-review-invitation', component:PendingReviewInvitationComponent , canActivate: [AuthGuard] },
  { path: 'non-carrier-review-invitation', component:ReviewInvitationComponent , canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewsRoutingModule { 

}
