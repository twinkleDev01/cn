import { Component, Input, OnInit } from "@angular/core";
import { CommonService } from "src/app/commons/service/common.service";

@Component({
    selector: 'app-digital-marking-social-media',
    templateUrl: './digital-marking-social-media.component.html',
    styleUrls: ['./digital-marking-social-media.component.css']
  })
export class DigitalMarkingSocialMediaComponenet {
  @Input() title: string;
  @Input() description: string;
  @Input() imageData: string;
  @Input() profilUrl:string
  constructor(
    public CommonService:CommonService
  ){}

  formatDescription(description): string {
  return description.replace(/\n/g, '<br>');
    }
    
}