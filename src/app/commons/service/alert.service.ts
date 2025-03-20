import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Injectable({
  providedIn: 'root',
})

export class AlertService {
  constructor(private http: HttpClient, private router: Router) {}
  showNotification(color, form, align, message) {
    const type = color;
    $.notify(
      {
        icon: 'notifications',
        message: message,
      },
      {
        allow_dismiss: true,
        //newest_on_left: true,
        placement: {
          from: form,
          align: align,
        },
        type: type,
        delay: 3000,
        timer: 10000,
        template:
          '<div data-notify="container" class="col-xl-3 col-lg-3 col-11 col-sm-3 col-md-3 success_alert alert alert-{0} alert-with-icon" role="alert" style="background-color: #fff; box-shadow: #091e424f 0px 0px 1px, #091e4240 0px 0px 12px -8px; color: #42526e; max-width: 400px; border-radius: 3px; padding-left: 56px;">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons txt_g" style="font-size: 16px; font-weight: bold; padding: 8px 0 0;">close</i></button>' +
          '<i class="material-icons txt_s" data-notify="icon" style="font-size: 24px; top: auto; margin-top: auto;">check_circle</i> <i class="material-icons txt_d" data-notify="icon" style="font-size: 24px; top: auto; margin-top: auto;">cancel</i> <i class="material-icons txt_g" data-notify="icon" style="font-size: 24px; top: auto; margin-top: auto;">error</i> ' +
          '<span data-notify="title" style="font-size:14px; font-weight: bold; max-width: 90%; display: block;">{1}</span> ' +
          '<span data-notify="message" style="font-size:14px; font-weight: 400; max-height: 60px; overflow: hidden; padding: 5px 0 0;">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="" target="" data-notify="url"></a>' +
          '</div>',
      }
    );
  }
  // 
  showNotificationMessage(
    color,
    form,
    align,
    className,
    typeIcon,
    title,
    message
  ) {
    const typeIcon1 = typeIcon;
    const type = color;
    $.notify(
      {
        icon: 'notifications',
        title: title,
        message: message,
      },
      {
        allow_dismiss: true,

        placement: {
          from: form,
          align: align,
        },
        type: type,
        delay: 3000,
        timer: 1000,
        template:
          '<div data-notify="container" class="col-md-3 danger_alert alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close_btn mat-button" data-notify="dismiss"> <i class="material-icons">close</i> </button>' +
          '<i class="material-icons tlt_icon ' + className + '" data-notify="icon">' + typeIcon + '</i>' +
          '<span data-notify="title" class="title_alert">{1}</span>' +
          '<span data-notify="message" class="dis_alert">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="" target="" data-notify="url"></a>' +
          '</div>',
      }
    );
  }

  // 
  showErrorNotification(color, form, align, message) {
    $.notifyClose();
    const type = color;
    $.notify(
      {
        icon: 'notifications',
        message: message,
      },
      {
        allow_dismiss: true,
        newest_on_top: true,
        type: type,
        delay: 20000,
        timer: 10000,
        placement: {
          from: form,
          align: align,
        },
        template:
          '<div data-notify="container" style="top:0px;" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="" target="" data-notify="url"></a>' +
          '</div>',
      }
    );
  }


}
