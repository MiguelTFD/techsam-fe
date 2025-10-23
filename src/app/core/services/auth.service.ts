import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);
  private tokenEndpoint = 'http://localhost:9000/oauth2/token';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('access_token');
    
    if (savedUser && savedToken) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isAuthenticated.set(true);
    }
  }

  // Método para client_credentials (sin usuario/contraseña)
  loginWithClientCredentials() {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('scope', 'read write'); // Solo scopes de aplicación, no openid/profile

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa('angular-client:secret')
    };

    return this.http.post<any>(this.tokenEndpoint, body.toString(), { headers }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        
        // Con client_credentials, no tenemos info del usuario
        // Pero podemos crear un usuario genérico
        const userData: User = {
          id: 1,
          username: 'angular-client',
          email: 'client@tienda.com',
          name: 'Cliente Angular',
          role: 'client'
        };

        this.currentUser.set(userData);
        this.isAuthenticated.set(true);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  // Método alternativo si quieres mantener usuario/contraseña
  // PERO usando un enfoque diferente
  login(username: string, password: string) {
    // Opción A: Usar client_credentials pero validar credenciales manualmente
    if (username === 'user' && password === '12345') {
      return this.loginWithClientCredentials();
    } else {
      throw new Error('Credenciales inválidas');
    }
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.currentUser();
  }

  isLoggedIn() {
    return this.isAuthenticated();
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}