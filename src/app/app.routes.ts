import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { InventoryPage } from './features/inventory-page/inventory-page';
import { SalesPage } from './features/sales-page/sales-page';
import { BrandsPage } from './features/brands-page/brands-page';
import { CategoriesPage } from './features/categories-page/categories-page';
import { UsersPage } from './features/users-page/users-page';
import { HomePage } from './features/home-page/home-page';
import { AuthGuard } from './core/guards/auth.guard';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
  { 
    path: 'login', 
    component: Login 
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
      { path: 'users', component: UsersPage },
    ]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];