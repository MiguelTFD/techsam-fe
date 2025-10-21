import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    // Verificar si hay usuario en localStorage al iniciar
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isAuthenticated.set(true);
    }
  }

  login(username: string, password: string): boolean {
    // Simulación de login - en un caso real harías una petición HTTP
    const users = [
      { id: 1, username: 'admin', password: 'admin123', email: 'admin@tienda.com', name: 'Administrador', role: 'admin' },
      { id: 2, username: 'vendedor', password: 'vendedor123', email: 'vendedor@tienda.com', name: 'Ana García', role: 'vendedor' },
      { id: 3, username: 'inventario', password: 'inventario123', email: 'inventario@tienda.com', name: 'Carlos López', role: 'inventario' }
    ];

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const userData: User = {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      };

      this.currentUser.set(userData);
      this.isAuthenticated.set(true);
      
      // Guardar en localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      return true;
    }
    
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
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
}