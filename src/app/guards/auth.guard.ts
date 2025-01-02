import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const userRole = localStorage.getItem('userRole');
    const loggedInUserId = localStorage.getItem('userId')

    if (userRole === 'admin') {
      return true;
    }

    // Redirect to login or another page if unauthorized
    return this.router.createUrlTree(['/']);
  }
}
