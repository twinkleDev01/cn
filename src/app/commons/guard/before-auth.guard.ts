import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class BeforeAuthGuard implements CanActivate {

  constructor(private router: Router, private route: ActivatedRoute) {}

  canActivate(): boolean {
    if (localStorage.getItem('access_token')) {
      this.router.navigate(['/profile/overview']);
    } else {
      return false;
    }
  }
}
