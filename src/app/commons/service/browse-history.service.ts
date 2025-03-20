import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RecentViewResponse } from '../interface/browse-history';

@Injectable({
  providedIn: 'root'
})
export class BrowseHistoryService {
  private apiUrl = `${environment.apiEndpointDev}`

  constructor(private http:HttpClient) { }

   /**
   * Fetch recently viewed carriers list
   * @param limit Number of results per page
   * @param page Page number for pagination
   * @returns Observable<any>
   */
  //  getRecentViewedCarriers(limit: number = 10, page: number = 1): Observable<RecentViewResponse> {
  //   return this.http.get<RecentViewResponse>(`${this.apiUrl}/api/recent-view/carrier-list?limit=${limit}&page=${page}`);
  // }
  getRecentViewedCarriers(limit: number, page: number): Observable<any> {
    const url = `/api/recent-view/carrier-list?limit=${limit}&page=${page}`;
    return this.http.get<any>(this.apiUrl + url);
  }
}
