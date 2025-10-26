import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

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

  // CONFIG: ajústalas si cambias puertos/paths
  private authServerUrl = 'http://localhost:9000';
  private tokenEndpoint = `${this.authServerUrl}/oauth2/token`;
  private authEndpoint = `${this.authServerUrl}/oauth2/authorize`;
  private clientId = 'angular-client';
  private redirectUri = 'http://localhost:4200/callback';
  private scope = 'openid profile read write';

  // keys en storage
  private readonly STORAGE_STATE = 'oauth_state';
  private readonly STORAGE_CODE_VERIFIER = 'pkce_code_verifier';
  private readonly STORAGE_ACCESS_TOKEN = 'access_token';
  private readonly STORAGE_REFRESH_TOKEN = 'refresh_token';
  private readonly STORAGE_USER = 'currentUser';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.initializeAuthState();
  }

  // --- inicialización desde localStorage ---
  private initializeAuthState(): void {
    const savedUser = localStorage.getItem(this.STORAGE_USER);
    const savedToken = localStorage.getItem(this.STORAGE_ACCESS_TOKEN);

    if (savedUser && savedToken && !this.isTokenExpired(savedToken)) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isAuthenticated.set(true);
    } else {
      // limpiar si token expiró
      if (savedToken && this.isTokenExpired(savedToken)) {
        this.clearStorage();
      }
    }
  }

  // --- PKCE helpers ---
  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  private base64UrlEncode(array: Uint8Array): string {
    // btoa on raw bytes:
    let str = '';
    for (let i = 0; i < array.length; i++) {
      str += String.fromCharCode(array[i]);
    }
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const hashed = new Uint8Array(digest);
    return this.base64UrlEncode(hashed);
  }

  // --- inicio del flujo (redirección al auth server) ---
  async startAuthorizationFlow(): Promise<void> {
    const state = this.generateRandomState();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Guardar para validar después
    localStorage.setItem(this.STORAGE_STATE, state);
    localStorage.setItem(this.STORAGE_CODE_VERIFIER, codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const authUrl = `${this.authEndpoint}?${params.toString()}`;
    console.log('[AuthService] redirecting to', authUrl);
    window.location.href = authUrl;
  }

  // --- intercambio del authorization code por tokens (usa code_verifier) ---
  handleAuthorizationCallback(code: string | null, state: string | null): Observable<any> {
    const savedState = localStorage.getItem(this.STORAGE_STATE);
    const codeVerifier = localStorage.getItem(this.STORAGE_CODE_VERIFIER);

    if (!code || !state) {
      return throwError(() => new Error('Code or state missing in callback'));
    }
    if (state !== savedState) {
      return throwError(() => new Error('Invalid state parameter'));
    }
    if (!codeVerifier) {
      return throwError(() => new Error('PKCE code_verifier missing'));
    }

    // Construir body x-www-form-urlencoded
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', this.redirectUri);
    body.set('client_id', this.clientId);
    body.set('code_verifier', codeVerifier);

    // IMPORTANTE: no enviar Authorization header (no client_secret)
    return this.http.post<any>(this.tokenEndpoint, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(response => {
        // guardar tokens y usuario
        localStorage.setItem(this.STORAGE_ACCESS_TOKEN, response.access_token);
        if (response.refresh_token) {
          localStorage.setItem(this.STORAGE_REFRESH_TOKEN, response.refresh_token);
        }
        // limpiar pkce/state
        localStorage.removeItem(this.STORAGE_STATE);
        localStorage.removeItem(this.STORAGE_CODE_VERIFIER);

        const userInfo = this.decodeJwt(response.access_token);
        const userData = this.createUserData(userInfo);
        this.currentUser.set(userData);
        this.isAuthenticated.set(true);
        localStorage.setItem(this.STORAGE_USER, JSON.stringify(userData));
      }),
      catchError(err => {
        console.error('[AuthService] token exchange failed', err);
        // limpiar elementos de PKCE/state por seguridad
        localStorage.removeItem(this.STORAGE_STATE);
        localStorage.removeItem(this.STORAGE_CODE_VERIFIER);
        return throwError(() => err);
      })
    );
  }

  // --- intentar manejar callback directamente desde la URL (útil para CallbackComponent) ---
  handleCallbackFromUrl(): Observable<any> {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code) {
      return throwError(() => new Error('No code in URL'));
    }
    return this.handleAuthorizationCallback(code, state);
  }

  // --- refresh token ---
  refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.STORAGE_REFRESH_TOKEN);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);
    body.set('client_id', this.clientId);

    return this.http.post<any>(this.tokenEndpoint, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(response => {
        localStorage.setItem(this.STORAGE_ACCESS_TOKEN, response.access_token);
        if (response.refresh_token) {
          localStorage.setItem(this.STORAGE_REFRESH_TOKEN, response.refresh_token);
        }
        const userInfo = this.decodeJwt(response.access_token);
        const userData = this.createUserData(userInfo);
        this.currentUser.set(userData);
        this.isAuthenticated.set(true);
        localStorage.setItem(this.STORAGE_USER, JSON.stringify(userData));
      }),
      catchError(err => {
        console.error('[AuthService] refresh token failed', err);
        this.logout(); // limpiar estado
        return throwError(() => err);
      })
    );
  }

  // --- login clásico (se mantiene para compatibilidad, redirige al flujo PKCE) ---
  login(username?: string, password?: string): Observable<void> {
    // Redirigimos al Authorization Code + PKCE
    return from(this.startAuthorizationFlow());
  }

  // --- client_credentials (opcional; NO para SPA usuarias humanas) ---
  // Nota: generalmente no se hace en frontend público; queda implementado por completitud.
  loginWithClientCredentials(): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('scope', 'read write');
    // Si tu backend requiere client credentials para este grant, este request debe salir desde backend,
    // no desde la SPA. Aquí lo dejamos, pero no es recomendado en producción.
    const basic = btoa(`${this.clientId}:secret-if-you-have`);
    return this.http.post<any>(this.tokenEndpoint, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${basic}` }
    }).pipe(
      tap(resp => {
        localStorage.setItem(this.STORAGE_ACCESS_TOKEN, resp.access_token);
      }),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  // --- utilidades ---
  private createUserData(tokenInfo: any): User {
    const username = tokenInfo.preferred_username || tokenInfo.sub || 'user';
    const name = tokenInfo.name || username;
    let role = 'user';
    if (tokenInfo.roles && tokenInfo.roles.includes('ADMIN')) {
      role = 'admin';
    } else if (tokenInfo.scope && tokenInfo.scope.includes('admin')) {
      role = 'admin';
    }
    return {
      id: tokenInfo.sub ? Number(tokenInfo.sub) : Date.now(),
      username,
      email: tokenInfo.email || `${username}@local`,
      name,
      role
    };
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

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeJwt(token);
    if (!decoded || !decoded.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.clearStorage();
    // Si tienes endpoint de logout en el auth server, podrías redirigirlo allí.
    this.router.navigate(['/login']);
  }

  private clearStorage(): void {
    localStorage.removeItem(this.STORAGE_ACCESS_TOKEN);
    localStorage.removeItem(this.STORAGE_REFRESH_TOKEN);
    localStorage.removeItem(this.STORAGE_USER);
    localStorage.removeItem(this.STORAGE_STATE);
    localStorage.removeItem(this.STORAGE_CODE_VERIFIER);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.STORAGE_ACCESS_TOKEN);
  }
}
