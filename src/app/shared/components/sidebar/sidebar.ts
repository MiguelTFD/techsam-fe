import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

   
isOpen = true;
  
  // Items del menú
  navItems = [
    { title: 'Inicio', url: '/', icon: '🏠' },
    { title: 'Inventario', url: '/inventory', icon: '📦' },
    { title: 'Categorías', url: '/categories', icon: '🏷️' },
    { title: 'Marcas', url: '/brands', icon: '⭐' },
    { title: 'Ventas', url: '/sales', icon: '💰' },
    { title: 'Cerrar Sesión', url: '/logout', icon: '🚪', action: 'logout' }
  ];

  currentUser: any;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  // Método para logout
  onLogout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authService.logout();
    }
  }
}
