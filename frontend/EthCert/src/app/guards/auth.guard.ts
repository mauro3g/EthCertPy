// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn')) {
      return true; // Allow access to the route
    } else {
      // If not logged in, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}