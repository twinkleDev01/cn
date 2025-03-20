import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private route: ActivatedRoute) {}
  
  canActivate(): boolean {
    if (localStorage.getItem('access_token')) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
