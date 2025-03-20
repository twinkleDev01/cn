import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-unregistered',
  templateUrl: './unregistered.component.html',
  styleUrls: ['./unregistered.component.css']
})
export class UnregisteredComponent  {

  constructor(
    private router: Router,
    ) { }

  
  signUp(){
    this.router.navigateByUrl('/sign-up-user-type');
  }
}
