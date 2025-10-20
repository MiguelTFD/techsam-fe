import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { InventoryPage } from './features/inventory-page/inventory-page';
import { SalesPage } from './features/sales-page/sales-page';
import { BrandsPage } from './features/brands-page/brands-page';
import { CategoriesPage } from './features/categories-page/categories-page';

export const routes: Routes = [
  { 
    path: '', 
    component: Dashboard,
    children: [
      { path: 'inventory', component: InventoryPage },
      { path: 'categories', component: CategoriesPage },
      { path: 'brands', component: BrandsPage },
      { path: 'sales', component: SalesPage }
    ]
  }
];