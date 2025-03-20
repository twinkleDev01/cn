import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from './shared.service';
import { PopupComponent } from 'src/app/shared/popup/popup.component';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    public sharedService:SharedService,
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authToken = localStorage.getItem('access_token');
    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + authToken,
        },
      });
    }
    /* return next.handle(req); */
    return next.handle(req).pipe(
      tap(
        () => { },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if ((err.status === 401 || err.status === 403) && localStorage.getItem('access_token') && localStorage.getItem('login_type') == 'after_login') {
              localStorage.clear();
              sessionStorage.clear();
              this.sharedService.logOutuser.next(null);
              this.sharedService.updateTokenData.next(null);
              this.sharedService.setInfo(null);
              this.router.navigate(['/sign-in'])
              this.dialog.open(PopupComponent,{disableClose: true,
                // backdropClass: AppSettings.backdropClass,
                backdropClass: 'cn_custom_popup',
                width: '460px',
                data: { openPop: 'accessDenied' },})
            }
          }
        }
      )
    );
  }
}
