import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = { exp?: number; sub?: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private api = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  login(email: string, password: string) {
    // Cache the tokens right after login so every refresh stays logged in
    return this.api.login(email, password).pipe(
      tap(tokens => {
        if (!this.isBrowser) return;
        localStorage.setItem('access', tokens.access);
        localStorage.setItem('refresh', tokens.refresh);
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    }
    // Send the user back to login once their session is gone
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    const t = localStorage.getItem('access');
    if (!t) return false;
    try {
      const p = jwtDecode<JwtPayload>(t);
      // Expiry is provided in seconds, so multiply before checking
      return !p.exp || p.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
