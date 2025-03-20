export interface RecentViewResponse {
    success: boolean;
    message: string;
    response: {
      data: CarrierView[];
    };
  }
  
  export interface CarrierView {
    id: string;
    userId: string | null;
    carrierId: string;
    userType: string;
    position: number;
    isClick: boolean;
    impressionType: string;
    postalCode: string | null;
    platform: number;
    createdAt: string;
    updatedAt: string;
    osPlatform: string | null;
    browser: string | null;
    clickId: string | null;
    url: string | null;
    location: string;
    insight: string;
    carrier?: CarrierDetails;
  }
  
  export interface CarrierDetails {
    id: string;
    companyName: string;
    profileImage: string;
    city: string;
    state: string;
    averageRatingValue: number;
  }
  