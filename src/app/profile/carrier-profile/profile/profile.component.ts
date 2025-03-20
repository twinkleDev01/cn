import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/commons/service/alert.service';
import { CommonService } from 'src/app/commons/service/common.service';
import { SharedService } from 'src/app/commons/service/shared.service';
import { AppSettings } from 'src/app/commons/setting/app_setting';
import { StatusSetting } from 'src/app/commons/setting/status_setting';
import { SubscriptionPopupComponent } from 'src/app/shared/subscription-popup/subscription-popup.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

displayedColumns: string[] = ['name', 'insights', 'pageSource', 'profileRank', 'location', 'platform', 'os', 'browser', 'accessedAt', 'timeSinceAccess'];
  dataSource = [
    { name: 'Jax Logistics LLC',
      insights: 'You check your profile',
      pageSource: 'Broker detail',
      profileRank: 1,
      location: '82934, Alachua, Florida',
      platform: 'fa-desktop',
      os: '/assets/images/windows.png',
      browser: '/assets/images/chrome.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      insights: 'Profile ranked on 1 position',
      pageSource: 'Broker insurance history',
      profileRank: 2,
      location: '43232, Columbus, Ohio',
      platform: 'fa-tablet',
      os: '/assets/images/android.png',
      browser: '/assets/images/safari.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      insights: 'Profile ranked on 1 position',
      pageSource: 'Broker insurance history',
      profileRank: 2,
      location: '43232, Columbus, Ohio',
      platform: 'fa-mobile',
      os: '/assets/images/ios.png',
      browser: '/assets/images/firefox.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      insights: 'Profile ranked on 1 position',
      pageSource: 'Broker insurance history',
      profileRank: 2,
      location: '43232, Columbus, Ohio',
      platform: 'fa-desktop',
      os: '/assets/images/macOS.png',
      browser: '/assets/images/opera.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      insights: 'Profile ranked on 1 position',
      pageSource: 'Broker insurance history',
      profileRank: 2,
      location: '43232, Columbus, Ohio',
      platform: 'fa-mobile',
      os: '/assets/images/linux.png',
      browser: '/assets/images/other_browser.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      insights: 'Profile ranked on 1 position',
      pageSource: 'Broker insurance history',
      profileRank: 2,
      location: '92807, Anaheim Hills, CA ',
      platform: 'fa-desktop',
      os: '/assets/images/ubuntu.png',
      browser: '/assets/images/chrome.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      insights: 'Profile ranked on 1 position',
      pageSource: 'Broker insurance history',
      profileRank: 2,
      location: '96101, Alturas, Califonia',
      platform: 'fa-desktop',
      os: '/assets/images/other_os.png',
      browser: '/assets/images/safari.png',
      accessedAt: '09 Oct, 2020',
      timeSinceAccess: '2 hours ago'
    },    { name: 'Jax Logistics LLC 1',
      insights: 'Profile ranked on 1 position',
      pageSource: 'Broker insurance history',
      profileRank: 2,
      location: '43232, Columbus, Ohio',
      platform: 'fa-mobile',
      os: '/assets/images/linux.png',
      browser: '/assets/images/other_browser.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      insights: 'Profile ranked on 1 position',
      pageSource: 'Broker insurance history',
      profileRank: 2,
      location: '92807, Anaheim Hills, CA ',
      platform: 'fa-desktop',
      os: '/assets/images/ubuntu.png',
      browser: '/assets/images/chrome.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      insights: 'Profile ranked on 1 position',
      pageSource: 'Broker insurance history',
      profileRank: 2,
      location: '96101, Alturas, Califonia',
      platform: 'fa-desktop',
      os: '/assets/images/other_os.png',
      browser: '/assets/images/safari.png',
      accessedAt: '09 Oct, 2020',
      timeSinceAccess: '2 hours ago'
    },
  ];



  public dropdownOpen = false;
  public checkPlan:boolean=false;
  public newInstructions: string = '';
  public looping: boolean = false;
  public AiMessage: string = ''
  public newMessage: any = [];
  public newMessagePrompt: any;
  public improvewriting: boolean = false;
  public changeTone: boolean = false;
  public translateInto: boolean = false;
  public messages: any[] = [];
  public AIInstructions: any;
  public remainingResponse: any;
  public enableDisable: Boolean = false;
  public isUserGenerate: boolean = true;
  public description: string = '';
  public generatedMessage: string = ''
  typingSpeed: number = 150;
  public isSendMessage: boolean = false;
  public profileEdit: FormGroup;
  public getUserData: any;
  public subscription: boolean = true;
  public loading = false;
  public skeletonLoader = false;
  public showEditAbleButton: boolean = false;
  public userInstructions: any = []
  public information: any;
  public userType: any;
  public isButtonDisabled: boolean = true;
  errorMessage: any;
  errerApi: any;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    public alertService: AlertService,
    public dialog: MatDialog,
    private sharedService: SharedService, private elementRef: ElementRef) { }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const wrapperElement = this.elementRef.nativeElement.querySelector('.box_header');
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
    this.information = StatusSetting.information;
    this.userType = localStorage.getItem('user_type')
    this.profileEdit = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(64)]],
      companyName: ['', [Validators.required, Validators.maxLength(64)]],
      lastName: ['', [Validators.required, Validators.maxLength(64)]],
      website: ['', [Validators.pattern('^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$')]],
      aboutCompany: ['', [Validators.required]],
      companySlogan: ['', [Validators.required, Validators.maxLength(100)]],
      dunsNumber: ['', [Validators.maxLength(9), Validators.minLength(9), Validators.pattern("^[0-9]*$")]],
      scacNumber: ['', [Validators.maxLength(4),Validators.pattern('^[a-zA-Z ]*$')]],
    });
    if (localStorage.getItem("access_token")) {
      this.skeletonLoader = true;
      this.getUserProfile();
    }
  }

  generateFakeSkeleton(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  getUserProfile() {
    let uri = null;
    let newParams = {};
    if (newParams) uri = this.commonService.getAPIUriFromParams(newParams);
    let APIparams = {
      apiKey: this.sharedService.getUrl(),
      uri: uri,
    };
    this.commonService.getList(APIparams).subscribe((ServerRes) => {
      if (ServerRes.success === true) {
        this.getUserData = ServerRes.response;
        localStorage.setItem('subscriptionPlanType',ServerRes.response?.subscriptionPlanType)
        localStorage.setItem('login_type', ServerRes.response?.subscriptionPlanType == 0 ? 'before_login' : 'after_login');
        ServerRes?.response?.subscriptionPlanType == 0 ? this.router.navigateByUrl('/subscription/plan') : ''
      ServerRes?.response?.subscriptionPlanType ==0 ? localStorage.setItem('confirm','false') : localStorage.setItem('confirm','true')

        if(this.getUserData?.aboutCompany){
          this.description=this.getUserData?.aboutCompany;
         
          this.enableDisable = true;
          this.isButtonDisabled = false;
        }
        this.getValueForm()
        this.skeletonLoader = false;
      }
    },
    (error) => {
      this.skeletonLoader = false;
      this.loading = false
    });
  }
  getValueForm() {
    this.profileEdit = this.formBuilder.group({
      firstName: [this.getUserData.firstName ? this.getUserData.firstName : '', [Validators.required, Validators.maxLength(64)]],
      companyName: [this.getUserData.companyName ? this.getUserData.companyName : '', [Validators.required, Validators.maxLength(64)]],
      lastName: [this.getUserData.lastName ? this.getUserData.lastName : '', [Validators.required, Validators.maxLength(64)]],
      website: [this.getUserData.website ? this.getUserData.website : '', [Validators.pattern(
        '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
      ),]],
      aboutCompany: [this.getUserData.aboutCompany ? this.getUserData.aboutCompany : '', [Validators.required]],
      companySlogan: [this.getUserData.companySlogan ? this.getUserData.companySlogan : '', [Validators.required, Validators.maxLength(100)]],
      dunsNumber: [this.getUserData.dunsNumber ? this.getUserData.dunsNumber : '', [Validators.maxLength(9),Validators.minLength(9), Validators.pattern("^[0-9]*$")]],
      scacNumber: [this.getUserData.scacNumber ? this.getUserData.scacNumber : '', [Validators.maxLength(9),Validators.pattern('^[a-zA-Z ]*$')]],
    });
  }

  profileUpdate({ value, valid }) {
    if (valid) {
      this.loading = true;
      let APIparams = {
        apiKey: AppSettings.APIsNameArray.USER.UPDATE,
        uri: '',
        postBody: value,
      };
      this.commonService.put(APIparams).subscribe(
        (success) => {
          this.loading = false;
          if (success.success === true) {
            this.sharedService.userDataPass.next('update')
            this.alertService.showNotificationMessage(
              'success',
              'bottom',
              'left',
              'txt_s',
              'check_circle',
              'User Profile',
              'You have successfully updated user profile.'
            );
          } else if (success.success === false) {
            if(success.error.aboutCompany){
            this.errorMessage = true;
            }
            // this.errerApi = success.error.aboutCompany
            this.alertService.showNotificationMessage(
              'danger',
              'bottom',
              'left',
              'txt_d',
              'check_circle',
              'User Profile',
              'You have not successfully updated user profile.'
            );
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

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  onlyAlphabetsKey(event) {
     return (event.charCode >= 65 && event.charCode <= 90) ? null : (event.charCode >= 97 && event.charCode <= 122);
  }
  

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  UTCDate(date: any) {
    date = new Date(date + ' ' + 'UTC');
    date.setHours(0, 0, 0, 0);
    return date;
  }

  closeOptions() {
    this.dropdownOpen = false; // Reset showHover when options are closed
    this.enableDisable = false
  }

  checkDecription(event: any) {
    if (event.target.value.trim() === '') return this.enableDisable = true;
  }

  sendInformation(instructionType: any) {
    if (this.getUserData.subscriptionPlanType == 3) {
      if (instructionType == 'Enter custom prompt') {
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
        let text = '';
        text = this.generateText(instructionType);
        this.userInstructions.push(text);
        // this.enableDisable = true;
      }
      else if (instructionType == 'Generate based on summary') {
        this.isSendMessage = true;
        this.dropdownOpen = false;
        this.improvewriting = true;
        this.changeTone = true;
        this.newMessage.push(instructionType);
        if (this.newMessage.length > 1) {
          this.newMessage = this.newMessage.join(', ');
        }
        let text = '';
        text = this.generateText(instructionType);
        this.userInstructions.push(text);

      }
      else if (instructionType == 'Fix spelling and grammar' || instructionType == 'Make it longer' || instructionType == 'Make it shorter' || instructionType == 'Rewrite' || instructionType == 'Improve structure' || instructionType == 'Make more persuasive' || instructionType == 'Summarize') {
        this.isSendMessage = true;
        this.improvewriting = true;
        this.dropdownOpen = false;
        this.showEditAbleButton = false;
        this.newInstructions = instructionType
        this.newMessage.push(instructionType)
        if (this.newMessage.length > 1) {
          this.newMessage = this.newMessage.join(', ');
        }
        let text = '';
        text = this.generateText(instructionType);
        this.userInstructions.push(text);
      }

      else if (instructionType == 'Informative' || instructionType == 'Friendly' || instructionType == 'Professional' || instructionType == 'Helpful') {
        this.newMessage.push(instructionType);
        if (this.newMessage.length > 1) {
          this.newMessage = this.newMessage.join(', ');
        }
        this.isSendMessage = true;
        this.dropdownOpen = false;
        this.changeTone = true;
        this.newInstructions = instructionType
        this.showEditAbleButton = false;
        let text = '';
        text = this.generateText(instructionType);
        this.userInstructions.push(text)
      }
      else if (instructionType == 'AIGenerated') {
        this.showEditAbleButton = false
        let text = '';
        text = this.generateText(instructionType);
        this.AIInstructions = text;
        this.sendMessage();
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

  generateText(text) {
    const object = {
      'Professional': 'tone_professional',
      'Helpful': 'tone_helpful',
      'Informative': 'tone_informative',
      'Friendly': 'tone_friendly',
      'AIGenerated': 'ai',
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



  checkTextarea(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    if (!target.value) {
      this.enableDisable = false;
      this.description = null;
      this.isButtonDisabled = true

    }
    else {
      this.profileEdit.controls.aboutCompany.setValue(target.value);
      this.isButtonDisabled = false;
    }
    if(target.value.length >1024){
    this.errorMessage = true;
    }else{
      this.errorMessage = false;

    }
  }

  saveUserGenerated() {
    this.profileEdit.controls.aboutCompany.setValue(this.description);
  }

  sendMessage() {
    this.loading = true;
    let requestBody: any;
    if (this.AIInstructions == 'ai') {
      requestBody = {
        "type": this.AIInstructions
      };
    }
    else if (this.AIInstructions == 'tryAgain') {
      requestBody = {
        instructions: this.userInstructions.map(id => ({ id })),
        "prompt": this.profileEdit?.controls?.aboutCompany.value
      };
    }
    else {
      requestBody = {
        instructions: this.userInstructions.map(id => ({ id })),
        "prompt": this.description || this.newMessage
      };
    }
    if (requestBody) {
      let APIparams;
      APIparams = {
        apiKey: AppSettings.APIsNameArray.CARRIERS.AI,
        uri: '',
        postBody: requestBody,
      };
      this.commonService.post(APIparams).subscribe(
        (response) => {
          this.loading = false;
          if (response.success === true) {
            if (response?.response) {
              this.remainingResponse = response.response
              this.isUserGenerate = false;
              this.dropdownOpen = false;
              this.isSendMessage = false;
              this.enableDisable = true;
              this.improvewriting = false;
              this.changeTone = false;
              this.translateInto = false;
              this.loading = false;
              this.messages = [];
              this.description = null
              this.displayResponseWordByWord(response.response);
            }

          } else if (response.success === false) {
          }
        },
        (error) => {
          this.loading = false;
        });
    }

  }


  async displayResponseWordByWord(response: string) {
    this.looping = true;
    this.profileEdit?.controls?.aboutCompany?.setValue(response)
    const wordsArray = response?.split(' ');
    for (let i = 0; i < wordsArray.length; i++) {
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

  useGeneratedText() {
    this.description = this.remainingResponse;
    this.looping = false;
    this.showEditAbleButton = false;
    this.messages = [];
    this.newMessage = [];
    this.AIInstructions = null;
    this.userInstructions = [];
    this.isButtonDisabled = false;
    this.profileEdit.controls.aboutCompany.setValue(this.description);
  }

  tryAgainGeneratedText(type: any) {
    this.userInstructions = [];
    this.showEditAbleButton = false;
    this.looping = false;
    this.messages = [];
    this.AIInstructions = type;
    let text = '';
    text = this.generateText(type);
    this.userInstructions.push(text);
    this.sendMessage()
    // this.AiMessage = this.AiMessage.concat('. Please try again if there is a better way to achieve the desired functionality.')
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


  subsciptionPlanCheck(){
    if(this.checkPlan){
     this.subscriptionUpgrade();
    }
   }

  subscriptionUpgrade(){
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      disableClose: true,
      backdropClass: 'cn_custom_popup',
      width: '1000px',
      data: { openPop: 'freePlan', type:'checkPremium'},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'ok') {
      }
    });
   }


   isAddressEmpty(address1: any,address2:any, city:any, countryCode:any, stateCode:any, zipShort:any): boolean {
    return !address1 &&
           !address2 &&
           !city &&
           !countryCode &&
           !stateCode &&
           !zipShort;
  }

  // Method to format an address for display
  getFormattedAddress(address1,address2, city, countryCode, stateCode, zipShort){
    let formattedAddress = '';
    // Helper function to capitalize the first letter of each word
    const toTitleCase = (str: string) => 
      str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    if (address1) {
      formattedAddress += toTitleCase(address1.trim()) + ', \n';
    }
    if (address2) {
      formattedAddress += toTitleCase(address2.trim()) + ', \n';
    }
    if (city) {
      formattedAddress += toTitleCase(city.trim()) + ', ';
    }
    if (stateCode) {
      formattedAddress += stateCode.trim() + ', ';  // State codes are usually uppercase
    }
    if (zipShort) {
      formattedAddress += zipShort.trim() + ', ';
    }
    if (countryCode) {
      formattedAddress += countryCode.trim();
    }
  
    formattedAddress = formattedAddress.trim();
  
    // Ensure no whitespace before commas
    formattedAddress = formattedAddress.replace(/\s+,/g, ',');
  
    return formattedAddress;
  
  }
   
}
