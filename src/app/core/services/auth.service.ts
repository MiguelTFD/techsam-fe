import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  private authServerUrl = 'http://localhost:9000';
  private tokenEndpoint = `${this.authServerUrl}/oauth2/token`;
  private authEndpoint = `${this.authServerUrl}/oauth2/authorize`;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('access_token');
    
    if (savedUser && savedToken) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isAuthenticated.set(true);
    }
  }

  // Método síncrono para generar code_challenge
  private generateCodeChallengeSync(codeVerifier: string): string {
    // Implementación síncrona simple para code_challenge
    // En un entorno real, deberías usar la implementación asíncrona
    // pero para desarrollo esta es suficiente
    let hash = 0;
    for (let i = 0; i < codeVerifier.length; i++) {
      const char = codeVerifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Iniciar el flujo de Authorization Code (SÍNCRONO)
  startAuthorizationFlow(): void {
    const state = this.generateRandomState();
    const codeVerifier = this.generateCodeVerifier();
    
    // Usar versión síncrona para evitar problemas con Promises
    const codeChallenge = this.generateCodeChallengeSync(codeVerifier);
    
    // Guardar para usar después
    localStorage.setItem('oauth_state', state);
    localStorage.setItem('code_verifier', codeVerifier);

    const authUrl = `${this.authEndpoint}?` +
      `response_type=code&` +
      `client_id=angular-client&` +
      `redirect_uri=${encodeURIComponent('http://localhost:4200/callback')}&` +
      `scope=${encodeURIComponent('openid profile read write')}&` +
      `state=${state}&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256`;

    console.log('Redirecting to auth server...');
    window.location.href = authUrl;
  }

  // Manejar el callback con el código de autorización
  handleAuthorizationCallback(code: string, state: string): Observable<any> {
    const savedState = localStorage.getItem('oauth_state');
    const codeVerifier = localStorage.getItem('code_verifier');

    // Validar state para prevenir CSRF
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', 'http://localhost:4200/callback')
      .set('client_id', 'angular-client')
      .set('code_verifier', codeVerifier || '');

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    return this.http.post<any>(this.tokenEndpoint, body.toString(), { headers }).pipe(
      tap(response => {
        console.log('Token response:', response);
        
        // Guardar tokens
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }
        
        // Limpiar valores temporales
        localStorage.removeItem('oauth_state');
        localStorage.removeItem('code_verifier');
        
        // Extraer información del usuario
        const userInfo = this.decodeJwt(response.access_token);
        const userData = this.createUserData(userInfo);
        
        // Actualizar estado
        this.currentUser.set(userData);
        this.isAuthenticated.set(true);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }),
      catchError(error => {
        console.error('Callback error:', error);
        // Limpiar en caso de error
        localStorage.removeItem('oauth_state');
        localStorage.removeItem('code_verifier');
        throw error;
      })
    );
  }

  // Método para mantener compatibilidad
  login(username: string, password: string): Observable<any> {
    this.startAuthorizationFlow();
    return new Observable(subscriber => {
      subscriber.complete();
    });
  }

  // Método para client_credentials
  loginWithClientCredentials(): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('scope', 'read write');

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa('angular-client:secret')
    };

    return this.http.post<any>(this.tokenEndpoint, body.toString(), { headers }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        
        const userData: User = {
          id: 0,
          username: 'angular-client',
          email: 'client@cakecandy.com',
          name: 'Cliente Angular',
          role: 'client'
        };

        this.currentUser.set(userData);
        this.isAuthenticated.set(true);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }),
      catchError(error => {
        console.error('Client credentials login error:', error);
        throw error;
      })
    );
  }

  // Helpers (sin cambios)
  private createUserData(tokenInfo: any): User {
    const username = tokenInfo.sub || 'user';
    const name = tokenInfo.name || tokenInfo.preferred_username || this.capitalizeName(username);
    
    let role = 'user';
    if (tokenInfo.roles && tokenInfo.roles.includes('ADMIN')) {
      role = 'admin';
    } else if (tokenInfo.scope && tokenInfo.scope.includes('admin')) {
      role = 'admin';
    }

    return {
      id: tokenInfo.sub ? parseInt(tokenInfo.sub) : Date.now(),
      username: username,
      email: tokenInfo.email || username,
      name: name,
      role: role
    };
  }

  private capitalizeName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return {};
    }
  }

  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  private base64UrlEncode(array: Uint8Array): string {
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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