import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxLoadingModule } from 'ngx-loading';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NonCarrierNewEditReviewComponent } from './non-carrier-component/non-carrier-new-edit-review/non-carrier-new-edit-review.component';
import { InviteReviewComponent } from './carrier-component/invite-review/invite-review.component';
import {ReviewsRoutingModule} from './reviews-routing.module'
import { ManageReviewComponent } from './carrier-component/manage-review/manage-review.component';
import { AiInviteReviewComponent } from './carrier-component/ai-invite-review/ai-invite-review.component';
import { AiRespondReviewComponent } from './carrier-component/ai-respond-review/ai-respond-review.component';
import { AddReviewNewComponent } from './non-carrier-component/add-review-new/add-review-new.component';
import { NonCarrierManageReviewComponent } from './non-carrier-component/non-carrier-manage-review/non-carrier-manage-review.component';
import { WriteReviewComponent } from './non-carrier-component/write-a-review/write-a-review.component';
import { StarRatingComponent } from './non-carrier-component/star-rating/star-rating.component';
import { PendingReviewInvitationComponent } from './carrier-component/panding-review-invitation/pending-review-invitation.component';
import { ReviewInvitationComponent } from './non-carrier-component/review-Invitation/review-invitation.component';
import { AddReviewBrokerComponent } from './add-review-broker/add-review-broker.component';
import { EditReviewBroker } from './edit-review-broker/edit-review-broker.component';
@NgModule({
  declarations: [
    WriteReviewComponent,
    NonCarrierNewEditReviewComponent,
    InviteReviewComponent,
    ManageReviewComponent,
    AiRespondReviewComponent,
    AiInviteReviewComponent,
    NonCarrierManageReviewComponent,
    AddReviewNewComponent,
    StarRatingComponent,
    PendingReviewInvitationComponent,
    ReviewInvitationComponent,
    AddReviewBrokerComponent,
    EditReviewBroker,
  ],
  imports: [
    ReviewsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    NgxSkeletonLoaderModule,
    NgxLoadingModule,
    CommonModule,
  ],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
})
export class ReviewsModule { }
