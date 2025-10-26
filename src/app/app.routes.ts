import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { InventoryPage } from './features/inventory-page/inventory-page';
import { SalesPage } from './features/sales-page/sales-page';
import { BrandsPage } from './features/brands-page/brands-page';
import { CategoriesPage } from './features/categories-page/categories-page';
import { UsersPage } from './features/users-page/users-page';
import { HomePage } from './features/home-page/home-page';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard'; // Importa el AdminGuard
import { Login } from './features/auth/login/login';
import { CallbackComponent } from './features/auth/callback/callback';

export const routes: Routes = [
  { 
    path: 'login', 
    component: Login 
  },
  { 
    path: 'callback', 
    component: CallbackComponent 
  },
  { 
    path: '', 
    component: Dashboard,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomePage },
      { path: 'inventory', component: InventoryPage },
      { path: 'categories', component: CategoriesPage },
      { path: 'brands', component: BrandsPage },
      { path: 'sales', component: SalesPage },
      { 
        path: 'users', 
        component: UsersPage,
        canActivate: [AdminGuard] // Solo admin puede acceder
      },
    ]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];