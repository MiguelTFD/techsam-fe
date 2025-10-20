import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  { title: 'Ventas', url: '/sales', icon: '💰' }
  ];

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
