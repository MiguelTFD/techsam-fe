// core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // No agregar token a las peticiones de autenticación (van al auth server en 9000)
  if (req.url.includes('/oauth2/token') || req.url.includes('localhost:9000')) {
    return next(req);
  }

  // Agregar token a las peticiones al resource server (puerto 8081)
  const authToken = localStorage.getItem('access_token');
  
  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(authReq);
  }

  return next(req);
};