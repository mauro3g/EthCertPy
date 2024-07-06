// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const storageLogged = localStorage.getItem('isLoggedIn')
    // Check if user is logged in
    if (Boolean(storageLogged)) {
      console.log(storageLogged)
      return true; // Allow access to the route
    } else {
      console.log('not loged')
      // If not logged in, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}