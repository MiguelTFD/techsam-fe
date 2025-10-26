// admin.guard.ts
import { Injectable, inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.hasRole('admin')) {
      return true;
    } else {
      // Redirigir al dashboard con un mensaje o simplemente al dashboard
      console.warn('Acceso denegado: se requiere rol de administrador');
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}