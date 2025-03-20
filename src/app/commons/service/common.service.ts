// based on hostname use the apiend point

import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppSettings } from '../setting/app_setting';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  // public seodata= new Subject<any>();
  public sendTokanUpdate = new Subject<string>();
  public configData = new BehaviorSubject<string>(null);
  public userData = new Subject<string>();
  public userAddres = new Subject<string>();


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,

  ) { }
  getList(APIparams): Observable<any> {
    //this variable will be used to hold the absoulate URL of API
    let apiUrl = '';

    // If the API slug passed in service then, we'll get the full API URL by this function
    if (APIparams.apiKey) apiUrl = this.getAPIUrl(APIparams.apiKey);

    // Appending The URI in APIs URL
    if (APIparams.uri) apiUrl = apiUrl + '?' + APIparams.uri;

    return this.http.get(apiUrl).pipe(map((res) => {
      return res;
    }));
  }
  post(APIparams): Observable<any> {
    //this variable will be used to hold the absoulate URL of API
    let apiUrl = '';
    // If the API slug passed in service then, we'll get the full API URL by this function
    if (APIparams.apiKey) apiUrl = this.getAPIUrl(APIparams.apiKey);
    // Appending The URI in APIs URL
    if (APIparams.uri) apiUrl = apiUrl + '?' + APIparams.uri;

    // Validating an HTTP POST BODY
    if (!APIparams.postBody) APIparams.postBody = {};
    /*  //get headers 
        let headers = this.getHeaders();
    */
    let checkKeyvalue = this.checkBlankValue(APIparams.postBody);

    return this.http.post(apiUrl, checkKeyvalue /*,headers*/).pipe(map((res) => {
      return res;

    }));
  }

  put(APIparams): Observable<any> {
    //this variable will be used to hold the absoulate URL of API
    let apiUrl = '';
    // If the API slug passed in service then, we'll get the full API URL by this function
    if (APIparams.apiKey) apiUrl = this.getAPIUrl(APIparams.apiKey);
    // Appending The URI in APIs URL
    if (APIparams.uri) apiUrl = apiUrl + '?' + APIparams.uri;

    // Validating an HTTP POST BODY
    if (!APIparams.postBody) APIparams.postBody = {};
    /*  //get headers 
        let headers = this.getHeaders();
    */
    let checkKeyvalue = this.checkBlankValue(APIparams.postBody);

    return this.http.put(apiUrl, checkKeyvalue /*,headers*/).pipe(map((res) => {
      return res;
    }));
  }

  putAllValue(APIparams): Observable<any> {
    //this variable will be used to hold the absoulate URL of API
    let apiUrl = '';
    // If the API slug passed in service then, we'll get the full API URL by this function
    if (APIparams.apiKey) apiUrl = this.getAPIUrl(APIparams.apiKey);
    // Appending The URI in APIs URL
    if (APIparams.uri) apiUrl = apiUrl + '?' + APIparams.uri;

    // Validating an HTTP POST BODY
    if (!APIparams.postBody) APIparams.postBody = {};
    /* //get headers 
          let headers = this.getHeaders();
      */
    /*	         let checkKeyvalue=this.checkBlankValue(APIparams.postBody);*/

    return this.http.put(apiUrl, APIparams.postBody).pipe(map((res) => {
      return res;
    }));
  }
  postAllValue(APIparams): Observable<any> {
    //this variable will be used to hold the absoulate URL of API
    let apiUrl = '';
    // let checkKeyvalue = this.checkBlankValueFormdata(APIparams.postBody);
    // If the API slug passed in service then, we'll get the full API URL by this function
    if (APIparams.apiKey) apiUrl = this.getAPIUrl(APIparams.apiKey);

    // Appending The URI in APIs URL
    if (APIparams.uri) apiUrl = apiUrl + '?' + APIparams.uri;

    // Validating an HTTP POST BODY
    if (!APIparams.postBody) APIparams.postBody = [];

    return this.http.post(apiUrl, APIparams.postBody).pipe(map((res) => {
      return res;
    }));
  }

  postMediaMethod(APIparams): Observable<any> {
    //this variable will be used to hold the absoulate URL of API
    let apiUrl = '';
    let checkKeyvalue = this.checkBlankValueFormdata(APIparams.postBody);
    // If the API slug passed in service then, we'll get the full API URL by this function
    if (APIparams.apiKey) apiUrl = this.getAPIUrl(APIparams.apiKey);

    // Appending The URI in APIs URL
    if (APIparams.uri) apiUrl = apiUrl + '?' + APIparams.uri;

    // Validating an HTTP POST BODY
    if (!APIparams.postBody) APIparams.postBody = [];

    return this.http.post(apiUrl, checkKeyvalue).pipe(map((res) => {
      return res;
    }));
  }

  postMediaMethodAllValue(APIparams): Observable<any> {
    //this variable will be used to hold the absoulate URL of API
    let apiUrl = '';
    //let checkKeyvalue=this.checkBlankValueFormdata(APIparams.postBody);
    // If the API slug passed in service then, we'll get the full API URL by this function
    if (APIparams.apiKey) apiUrl = this.getAPIUrl(APIparams.apiKey);

    // Appending The URI in APIs URL
    if (APIparams.uri) apiUrl = apiUrl + '?' + APIparams.uri;

    // Validating an HTTP POST BODY
    if (!APIparams.postBody) APIparams.postBody = [];

    return this.http.post(apiUrl, APIparams.postBody).pipe(map((res) => {
      return res;
    }));
  }

  postMedia(APIparams): Observable<any> {
    let apiUrl = '';

    if (APIparams.apiKey) apiUrl = this.getAPIUrl(APIparams.apiKey);

    if (APIparams.uri) apiUrl = apiUrl + '?' + APIparams.uri;

    if (!APIparams.postBody) APIparams.postBody = [];

    const checkKeyvalue = this.checkBlankValueFormdata(APIparams.postBody);

    return this.http.put(apiUrl, checkKeyvalue).pipe(map((res) => {
      return res;
    }));
  }

  delete(APIparams): Observable<any> {
    let apiUrl = '';

    if (APIparams.apiKey) apiUrl = this.getAPIUrl(APIparams.apiKey);

    if (APIparams.uri) apiUrl = apiUrl + '?' + APIparams.uri;

    if (!APIparams.postBody) APIparams.postBody = {};

    return this.http.delete(apiUrl /*,headers*/).pipe(map((res) => {
      return res;
    }));
  }

  getAPIUrl(apiSlug: string) {
    // let checkAPI = apiSlug.split('/');
    // let checkAPINew = apiSlug.substr(apiSlug.indexOf('/')).replace('/', '');

// based on hostname use the apiend point
    let apiEndPoint
    if (window.location.origin == environment.domain) {
      apiEndPoint = environment.apiEndpoint
    } else {

      apiEndPoint = environment.apiEndpointDev
    }

    let apiUrl = '';
    if (apiSlug)
      apiUrl =
        apiEndPoint +
        '/' +
        AppSettings.API_GATEWAY +
        '/' +
        apiSlug;
    return apiUrl;

  }

  getAPIUriFromParams(params) {
    if (!params) return '';

    let url = new URLSearchParams();

    for (let key in params) if (params[key]) url.set(key, params[key]);
    return url.toString();
  }
  checkBlankValuePut(recordForm) {
    for (var propName in recordForm) {
      if (recordForm[propName] === undefined || recordForm[propName] === '') {
        delete recordForm[propName];
      }
    }
    return recordForm;
  }

  checkBlankValue(recordForm) {
    for (var propName in recordForm) {
      if (
        recordForm[propName] === null ||
        recordForm[propName] === undefined ||
        recordForm[propName] === ''
      ) {
        delete recordForm[propName];
      }
    }
    return recordForm;
  }

  checkBlankValueFormdata(recordForm) {
    const tempPostBody = new FormData();
    recordForm.forEach((V, K) => {
      if (
        V !== '' &&
        V !== null &&
        V !== 'null' &&
        V !== 'Invalid Da' &&
        typeof V !== undefined
      ) {
        tempPostBody.append(K, V);
      }
    });
    return tempPostBody;
  }

}
