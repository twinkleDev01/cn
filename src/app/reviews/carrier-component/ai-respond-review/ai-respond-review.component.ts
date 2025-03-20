// added broker API 
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { SubscriptionPopupComponent } from 'src/app/shared/subscription-popup/subscription-popup.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ai-respond-review',
  templateUrl: './ai-respond-review.component.html',
  styleUrls: ['./ai-respond-review.component.css']
})
export class AiRespondReviewComponent implements OnInit {
  public reviewList: any;
  public skeletonLoader: boolean = false;
  showAll: boolean[] = [];
  public loading = false;


  // AI-INVITE-REVIEW-LANGUAGE
  public dropdownOpen = false;
  public remainingResponse: any;
  public enableDisable: Boolean = false;
  public isUserGenerate: boolean = true;
  public description: string = '';
  public generatedMessage: string = ''
  typingSpeed: number = 150;
  public messages: any = []
  public isSendMessage: boolean = false;
  public looping: boolean = false;
  public AiMessage: any;
  public newInstructions: any;
  public newMessage: any = [];
  public showEditAbleButton: boolean = false;
  public improvewriting: boolean = false;
  public changeTone: boolean = false;
  public translateInto: boolean = false;
  public newMessagePrompt: any;
  public userInstructions: any = [];
  public AIInstructions: any;
  public isButtonDisabled: boolean = true;
  public responseErrror: any;
  public errrorMessage: any

  // Subscription
  public getUserData: any;

  constructor(
    public sharedService: SharedService,
    public commonService: CommonService,
    public alertService: AlertService,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private route: Router,
    private location: Location

  ) { }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const wrapperElement = this.elementRef.nativeElement.querySelector('.box_header');
    const closeCustumPrompt = this.elementRef.nativeElement.querySelector('#filter_banner');
    const insideSpanElement = this.elementRef.nativeElement.querySelector('#dropdown');
    const textReaElement = this.elementRef.nativeElement.querySelector('.text_area_new');
    if (!insideSpanElement?.contains(event.target) && !wrapperElement?.contains(event.target)) {
      this.dropdownOpen = false
    }
    if (textReaElement?.contains(event.target)) {
      this.isSendMessage = false
    }
  }

  ngOnInit(): void {
    this.skeletonLoader = true
    const reviewData = localStorage.getItem('userReview');
    this.reviewList = JSON.parse(reviewData);

    if (this.reviewList) {
      setTimeout(() => {
        this.skeletonLoader = false
      }, 2000);
    }
    this.getUserData = this.sharedService.getInfo();
    this.sharedService.userDataPass.subscribe((userData) => {
      if (userData) {
        this.getUserData = userData;
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

  toggleShowAll(index) {
    this.showAll[index] = !this.showAll[index];
  }

  //  AI-INVITE-REVIEW-LANGUAGE

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }


  sendInformation(instructions: any) {
    if (localStorage.getItem('subscriptionPlanType') == '3') {
      // document.getElementById('invite_div').classList.add('disabled-div');
      if (instructions == 'Enter custom prompt') {
        this.isSendMessage = true;
        this.dropdownOpen = false;
        this.improvewriting = true;
        this.changeTone = true;
        this.translateInto = true;
        this.description = null;
        this.AiMessage = null;
        this.messages = [];
        this.generatedMessage = null;
        this.showEditAbleButton = false;
        this.newMessagePrompt = null;
        this.newMessage = null
        let text = '';
        text = this.generateText(instructions);
        this.userInstructions.push(text)
      }
      else if (instructions == 'Generate based on summary') {
        this.isSendMessage = true;
        this.dropdownOpen = false;
        this.improvewriting = true;
        this.changeTone = true;
        this.translateInto = true;
        this.newMessage = instructions
        this.newInstructions = instructions
        let text = '';
        text = this.generateText(instructions);
        this.userInstructions.push(text)
      }
      else if (instructions == 'Fix spelling and grammar' || instructions == 'Make it longer' || instructions == 'Make it shorter' || instructions == 'Rewrite' || instructions == 'Improve structure' || instructions == 'Make more persuasive' || instructions == 'Summarize') {
        this.newMessage.push(instructions);
        if (this.newMessage.length > 1) {
          this.newMessage = this.newMessage.join(', ');
        }
        this.isSendMessage = true;
        this.improvewriting = true;
        this.dropdownOpen = false;
        this.showEditAbleButton = false;
        this.newInstructions = instructions
        let text = '';
        text = this.generateText(instructions);
        this.userInstructions.push(text);
      }
      else if (instructions == 'Informative' || instructions == 'Friendly' || instructions == 'Professional' || instructions == 'Helpful') {
        this.newMessage.push(instructions);
        if (this.newMessage.length > 1) {
          this.newMessage = this.newMessage.join(', ');
        }
        this.isSendMessage = true;
        this.dropdownOpen = false;
        this.changeTone = true;
        this.newInstructions = instructions
        this.showEditAbleButton = false;
        let text = '';
        text = this.generateText(instructions);
        this.userInstructions.push(text)
        // instructions !== undefined ? `${this.getUserInformation(instructions)}` : '';
      }
      else if (instructions == 'AIGenerated-Review') {
        this.isButtonDisabled = true;
        let text = '';
        text = this.generateText(instructions);
        this.AIInstructions = text;
        this.generateReview()
      }
    }
    else {
      const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
        disableClose: true,
        backdropClass: 'cn_custom_popup',
        width: '1000px',
        data: { openPop: 'freePlan', type: 'checkPremium' },
      });
       // Set the border-radius directly on the dialog container after it is opened
    dialogRef.afterOpened().subscribe(() => {
      const dialogContainer = document.querySelector('.mat-dialog-container');
      if (dialogContainer) {
        dialogContainer.setAttribute('style', 'border-radius: 15px !important;');
      }
    });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.event === 'ok') {
        }
      });
    }
  }

  checkDecription(event: any) {
    if (event.target.value.trim() === '') return this.enableDisable = true; this.isButtonDisabled = false;
  }

  userGenerated() {
    this.isUserGenerate = false;
    this.messages = [];
    this.newMessage = [];
    this.remainingResponse = [];
    this.isSendMessage = false;
    this.userInstructions = [];
  }

 
  checkTextarea(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    if (!target.value) {
      this.enableDisable = false;
      this.description = null;
      this.isButtonDisabled = true
    }
    else {
      this.isButtonDisabled = false
    }
  }

  saveUserGenerated() {
    // this.inviteReviewForm?.controls.overview.setValue(this.description);
  }

  useGeneratedText() {
    this.description = this.remainingResponse;
    this.looping = false;
    this.messages = [];
    this.showEditAbleButton = false;
    this.AIInstructions = null;
    this.userInstructions = [];
    this.newMessage = []
    this.isButtonDisabled = false;
    this.reviewList.carrierRespose = this.description;
  }

  tryAgainGeneratedText(type) {
    this.looping = false;
    this.messages = [];
    this.userInstructions = [];
    this.showEditAbleButton = false;
    this.AIInstructions = type;
    let text = '';
    text = this.generateText(type);
    this.userInstructions.push(text);
    this.generateReview()
  }

  discardGeneratedText() {
    this.description = null;
    this.messages = [];
    this.changeTone = false;
    this.improvewriting = false;
    this.showEditAbleButton = false;
    this.looping = false;
    this.enableDisable = false;
    this.AIInstructions = null;
    this.userInstructions = [];

  }



  // send action
  generateReview() {
    this.loading = true
    // document.getElementById('invite_div').classList.add('disabled-div');
    this.loading = true;
    let requestBody: any;
    if (this.AIInstructions == 'ai') {
      this.loading = true;
      requestBody = {
        "reviewRespond": this.reviewList?.review,
        "type": 'ai',
      }

    }
    else if (this.AIInstructions == 'tryAgain') {
      requestBody = {
        instructions: this.userInstructions.map(id => ({ id })),
        "prompt": this.remainingResponse
      };
    }
    else {
      requestBody = {
        instructions: this.userInstructions.map(id => ({ id })),
        "prompt": this.description || this.newMessage
      };
    }
    if (requestBody) {
      let APIparams: any;
      APIparams = {
        apiKey: AppSettings.APIsNameArray.REVIEW.AIRESPOND,
        uri: '',
        postBody: requestBody,
      };
      this.commonService.post(APIparams).subscribe(
        (success) => {
          this.loading = false;
          if (success.success === true) {
            this.remainingResponse = success.response

            this.loading = false
            if (this.remainingResponse) {
              // document.getElementById('invite_div').classList.remove('disabled-div');  

              this.isUserGenerate = false;
              this.dropdownOpen = false;
              this.isSendMessage = false;
              this.enableDisable = true;
              this.improvewriting = false;
              this.changeTone = false;
              this.loading = false;
              this.messages = [];
              this.description = null;
              this.AIInstructions = null;

              this.displayResponseWordByWord(success.response);
            }
            this.errrorMessage = null

          }
          else if (success.success === false) {
            this.errrorMessage = null;
            this.responseErrror = success.message;
            this.dropdownOpen = false;
            document.getElementById('invite_div').classList.remove('disabled-div');

          }
        },
        (error) => {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_g',
            'error',
            'Unexpected Error',
            AppSettings.ERROR
          );
          // this.errrorMessage=error.error.message;
          this.loading = false;
          this.dropdownOpen = false;

          document.getElementById('invite_div').classList.remove('disabled-div');

        });
    }

  }



  // new way
  async displayResponseWordByWord(response: string) {
    this.looping = true;
    // this.inviteReviewForm?.controls.overview.setValue(this.description);
    const wordsArray = response.split(' ');
    for (let i = 0; i < wordsArray.length; i++) {
      // this.remainingResponse = wordsArray.slice(i + 1).join(' '); // Store remaining words
      this.messages.push({ role: 'assistant', content: wordsArray[i] });
      this.showEditAbleButton = true;
      await this.delay(this.typingSpeed); // Wait for typingSpeed milliseconds
      if (!this.looping) {
        break;
      }
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateText(text) {
    const object = {
      'Professional': 'tone_professional',
      'Helpful': 'tone_helpful',
      'Informative': 'tone_informative',
      'Friendly': 'tone_friendly',
      'AIGenerated-Review': 'ai',
      'Enter custom prompt': 'custom',
      'Summarize': 'summary',
      'Make more persuasive': 'tone_convincing',
      'Improve structure': 'improve_structure',
      'Rewrite': 'improve_rewrite',
      'Make it shorter': 'improve_shorter',
      'Make it longer': 'improve_longer',
      'Fix spelling and grammar': 'improve_spelling',
      'Generate based on summary': 'summary',
      'tryAgain': 'tryAgain'

    }
    return object[text]
  }

  sendRespondReview() {
    if (this.description) {
      let respondReview;
      let APIparams;
    if(localStorage.getItem('user_type') == 'CARRIER') { 
       respondReview = {
        "reviewId": this.reviewList?.id,
        "carrierResponse": this.description 
      }
      this.loading = true;
       APIparams = {
        apiKey: AppSettings.APIsNameArray.REVIEW.RESPONDREVIEW,
        uri: '',
        postBody: respondReview,
      };
    }else if(localStorage.getItem('user_type') == 'BROKER'){
       respondReview = {
        "reviewId": this.reviewList?.id,
        "brokerResponse": this.description 
      }
      this.loading = true;
       APIparams = {
        apiKey: AppSettings.APIsNameArray.REVIEW.BROKERRESPONDREVIEW,
        uri: '',
        postBody: respondReview,
      };
    }

      this.commonService.post(APIparams).subscribe(
        (success) => {
          if (success.success === true) {
            this.route.navigateByUrl('review/manage-my-reviews')
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'Response',
              'Response has added successfully.'
            );
          } else if (success.success === false) {
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'Response',
              'Response has not added successfully.'
            );
            this.loading = false;
          }
        },
        (error) => {
          this.alertService.showNotificationMessage(
            'danger',
            'bottom',
            'left',
            'txt_g',
            'error',
            'Unexpected Error',
            AppSettings.ERROR
          );
          this.loading = false;
        }
      );
    }
  }

  backToManageReview() {
    this.location.back();
  }

  getFullName(firstName, lastName) {
    return firstName.concat(' ' + lastName)
  }

}
