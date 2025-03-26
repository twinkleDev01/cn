import { environment } from '../../../environments/environment';
export class AppSettings {
  public static API_ENDPOINT = 'https://carriernetwork.ai';

  public static API_GATEWAY = 'api';
  public static popWidth = '430px';
  public static popHeight = '240px';
  public static backdropClass = 'g-transparent-backdrop';
  public static emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  public static ERROR = 'Something went wrong, Please try again later.';
  public static APIsNameArray = {

    AUTH: {
      LOGIN:'login',
      FORGOTPASSWORDOTP: 'forgot_password',
      FORGOTPASSWORDVERIFY:'verify_forget_password_otp',
      RESETPASSWORD:'reset-password',
      PASSWORD:'reset-password',
      CARRIERADD : 'carrier/add',
      BROKERADD : 'broker/add',
      SHIPPERADD :"shipper/registration",
      // BROKERADD :"broker/registration",
      DISPATCHERADD :"dispatcher/registration",
      SELLERADD :"seller/registration",
      OTPVERIFY : 'user/verify-otp',
      CHANGEPASSWORD:'change_password',
      CHANGEEMAIL:'user/check-credentials',
      UPDATECREDENTIALS:'user/update-credentials',
    },
    NONCARRIERSAVELIST : {
      DELETE : 'save-list/delete',
      REMOVE :'save-list/remove-carrier-in-save-list'

    },

    USER: {
       GET : 'carrier/get',
       SEARCH : 'external/header-search',
       UPDATE : 'carrier/update',
       SHIPPERGET: 'shipper/get',
       SELLERGET: 'seller/get',
       BROKERGET: 'broker/get',
       DISPATCHERGET: 'dispatcher/get',
       SHIPPERUPDATE: 'shipper/update',
       SELLERUPDATE: 'seller/update',
       BROKERUPDATE: 'broker/update',
       DISPATCHERUPDATE: 'dispatcher/update',   
    },
    // RECENTVIEW: {
    //   NONCARRIERRECETVIEW : 'non-carrier-recent-view/list',
    //   CARRIERRECETVIEW : 'recently-viewed/carrier',
    //   BROKERVIEW : 'recently-viewed/broker'
    // },
    RECENTVIEW: {
      NONCARRIERRECETVIEW : 'non-carrier-recent-view/list',
      CARRIERRECETVIEW : 'recently-viewed/carrier',
      BROKERVIEW : 'recently-viewed/broker',
      CARRIERPROFILEANALYTICSVIEW: 'recent-view/carrier-profile-analitics',
      CARRIERCONTACTANALYTICSVIEW:'recent-view/carrier-contact-analitics'
    },
    PAYMENT:{
      SUBSCRIPTION:'subscription/buy-business-plan',   
    },
    REVIEW: {
      ADDREVIEW : 'carrier/review/invite-for-review',
      REVIEWSUMMARY : 'carrier/review/summary',
      REVIEWLIST : 'carrier/review/list',
      REVIEWADD : 'carrier/review/add',
      KEYPOINT : 'external/key-points/list',
      DELETE : 'carrier/review/delete',
      EDIT : 'carrier/review/edit',
      GETREVIEW:'carrier/review/get',
      GETCARRIEREVIEW:'carrier/get-for-add-review/get',
      LANEDELETE : 'lane-for-review/delete',
      EDITUPDATE : 'carrier/review/edit',
      AI:'ai/generate-review',
      INVITEAI:'ai/generate-invite-review',
      AIRESPOND:'ai/generate-review-respond',
      RESPONDREVIEW:'carrier/review/respond/add',
      PENDINGREVIEWINVITATIONLIST:'carrier/review/pending-review-invitation/list',
      PENDINGREVIEWINVITATIONDELETE:'carrier/review/pending-review-invitation/delete',
      PENDINGREVIEWINVITATIONRESEND:'carrier/review/resend',
      REVIEWINVITATIONLIST:'carrier/review/invite-review/list',
      FEATUREDREVIEW:'carrier-broker/review/featured/add',
      
      BROKERAI:'ai/generate-review-for-broker',
      BROKERRESPONDREVIEW:'broker/review/respond/add',
      BROKERREVIEWADD : 'broker/review/add',
      BROKERGETREVIEW:'broker/review/get',
      BROKEREDITUPDATE : 'broker/review/edit',
      GETBROKERREVIEW:'broker/get-for-add-review/get',
      DELETEBroker : 'broker/review/delete',
      CARRIERBROKERREVIEWLIST : 'carrier-broker/review/list',

      
    },

    EXTRA:{
       CONFIG: 'config/get',
       AUTOCOMPLETE:'external/autocomplete-search'
    },

    CARRIERSEARCH:{
      SEARCHLIST:'report/carrier-list',
      REPORTS:'report/list',
      SCHEDULEREPORT:'report/schedule'
    },

    TRIPCALCULATOR:{
      LISTCALCULATOR:'trip-calculator/list',
      CREATECALCULATOR:'trip-calculator/create',
      UPDATECALCULATOR:'trip-calculator/update',
      DELETECALCULATOR:'trip-calculator/delete'
    },

    TERMINAL :{
      LIST :'terminal/list',
      ADD:'terminal/add',
      DELETE:'terminal/delete',
      BROKERLIST:'terminal/list-for-broker',
      BROKERADD:'terminal/add-for-broker',
      BROKERDELETE:'terminal/delete-for-broker'
    },
    
    LaneRegions : {
      LANE : 'lane/state',
      UPDATE: 'lane/update',
      ADD:'lane/add',
      CITY:'lane/city',
      LIST:'lane/list',
      DELETE:'lane/delete'
    },

    REGIONS : {
      LIST : 'region/list'
    },

    AVAILIBILITY : {
      ADD : 'load-availability/add',
      LIST : 'load-availability/list',
      EDIT: 'load-availability/update',
      DELETE:'load-availability/delete'

    },

    LOADQUOTE : {
      CARRIERLIST : 'load-quotes/list-for-carrier-user',  
      BROKERLIST : 'load-quotes/list-for-broker-user',
      LOADQUOTESLIST : 'carrier-broker-load-quotes/list',
    },

    CARRIERS : {
      GET : 'carrier/get',
      UPDATE : 'carrier/update',
      DOTNUMBER :'admin/user-add-dot-carrier',
      AI:'ai/generate-overview'
    },
    
    SAVECARRIRLIST:{
      LIST:'save-list/list',
      SAVELIST:'save-list/list-carrier-in-save-list',
      RECENTVIEWS:'recent-view/list',
      ADDNOTE:'carrier-notes/add',
      DELETE : 'save-list/delete',
      UPDATENOTE:'carrier-notes/update',
      SAVECARRIERNOTES : 'carrier-notes/list',
      UPDATELISTNAME :'save-list/update',
      CREATESAVELIST :'save-list/add',
      DELETENOTE:'carrier-notes/delete',
      ADDSAVELIST:'save-list/add-carrier-in-save-lists',
      BROKERRECENTVIEWS:'recent-view-for-broker/list',
      
    },

    CARRIERSCONTACTINFOR : {
      ADDEMAIL : 'carrier-contact-information/add',
      ADDPHONE : 'carrier-contact-information/add',
      LIST : 'carrier-contact-information/list',
      DELETE : 'carrier-contact-information/delete',
      UPDATE : 'carrier-contact-information/update',
      CONFIG :'config/get',
      BROKERLIST : 'broker-contact-information/list',
      BROKERADDEMAIL : 'broker-contact-information/add',
      BROKERADDPHONE : 'broker-contact-information/add',
      BROKERDELETE : 'broker-contact-information/delete',
      BROKERUPDATE : 'broker-contact-information/update',
    },

    EXTERNAL : {
      CARRIERSEARCH : 'external/carrier-search-with-autocomplete',
      SEARCH    : 'external/autocomplete-search',
      CARRIERSEARCHDOT:'external/dot-search',
      BROKERSEARCHDOT:'external/dot-search-for-broker',
      BROKERSEARCH : 'external/broker-search-with-autocomplete',

    },
    MEDIA : {
      LIST : 'media/list-new',
      ADD : 'media/add-new',
      DELETE : 'media/delete',
      UPLOADIMAGE : 'user/profile-and-cover-image/update'
    },
    LOADPAYMENT : {
      LIST :'card/list',
      ADDCARD :'card/attach',
      REMOVECARD : 'card/delete'
    },
    PLAN : {
      ADDPLAN : 'subscription/buy-free-plan',
      BUYPLAN: 'subscription/generate-link'
    },
    INSURENCE : {
      GET :'carrier-insurance-coverages/get',
      ADD : 'carrier-insurance-coverage/add',
      DELETE: 'carrier-insurance-coverage/delete',
      EDIT: 'carrier-insurance-coverage/update',
    },
    DIGITALMARKETING:{
      ADD:'seo/add',
      GET:'seo/get',
      SOCIALMEDIAGET:'social-media/get',
      SOCIALMEDIAADD:'social-media/add',
    },
    SUBSCRIPTION : {
      GET: 'subscription/get',
      AUTORENEW: 'subscription/auto-renew',
      CONTACTUS: 'subscription/contact-me',

    }

  }
}
