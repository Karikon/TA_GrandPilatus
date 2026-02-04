import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('access');
    // Attach the current token to every API call if we have one handy
    if (token) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next(req);
};
