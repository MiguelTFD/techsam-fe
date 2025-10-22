import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Importaciones de Lucide - Asegúrate de importar CADA icono que uses
import { 
  LucideAngularModule,
  Home, 
  Package, 
  Tag, 
  Star, 
  DollarSign,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut 
} from 'lucide-angular';

// Interface para los items del menú
interface NavItem {
  title: string;
  url: string;
  icon: any;
  description?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule, 
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './sidebar.html', // Asegúrate que coincida con tu archivo
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {
  
  isOpen = true;
  currentUser: any;

  // Iconos para usar en el template
  icons = {
    user: User, // ✅ Definido como propiedad del componente
    logOut: LogOut, // ✅ Definido como propiedad del componente
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight
  };

  // Items del menú con iconos de Lucide
  navItems: NavItem[] = [
    { 
      title: 'Inicio', 
      url: '/', 
      icon: Home,
      description: 'Página principal'
    },
    { 
      title: 'Inventario', 
      url: '/inventory', 
      icon: Package,
      description: 'Gestión de inventario'
    },
    { 
      title: 'Categorías', 
      url: '/categories', 
      icon: Tag,
      description: 'Administrar categorías'
    },
    { 
      title: 'Marcas', 
      url: '/brands', 
      icon: Star,
      description: 'Gestión de marcas'
    },
    { 
      title: 'Ventas', 
      url: '/sales', 
      icon: DollarSign,
      description: 'Registro de ventas'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  onLogout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authService.logout();
    }
  }

  // Método para obtener el icono de toggle dinámico
  getToggleIcon() {
    return this.isOpen ? ChevronLeft : ChevronRight;
  }
}