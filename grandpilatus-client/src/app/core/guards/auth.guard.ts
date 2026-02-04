import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Let logged out users land on login but remember where they wanted to go
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login'], { queryParams: { r: state.url } });
};
