import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { 
  Package, ShoppingCart, TrendingUp, AlertTriangle, 
  Star, Cake, DollarSign, Users, Calendar, 
  ArrowUp, ArrowRight, CheckCircle, Clock
} from 'lucide-angular';

interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  inventoryStats: {
    total: number;
    available: number;
    lowStock: number;
  };
  salesStats: {
    today: number;
    growth: number;
  };
  lowStockCount: number;
  topCategory: string;
  popularProducts: Array<{
    name: string;
    icon: string;
    sales: number;
    stock: number;
  }>;
  reminders: Array<{
    icon: any;
    text: string;
    time: string;
    urgent: boolean;
  }>;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss']
})
export class HomePage implements OnInit {
  
  // Iconos de Lucide
  icons = {
    package: Package,
    shoppingCart: ShoppingCart,
    trendingUp: TrendingUp,
    alertTriangle: AlertTriangle,
    star: Star,
    cake: Cake,
    dollarSign: DollarSign,
    users: Users,
    calendar: Calendar,
    arrowUp: ArrowUp,
    arrowRight: ArrowRight,
    checkCircle: CheckCircle,
    clock: Clock
  };

  // Datos iniciales
  currentDate: string = '';
  loading: boolean = true;

  // Datos que vendrán del backend
  totalProducts: number = 0;
  totalRevenue: number = 0;
  inventoryStats = { total: 0, available: 0, lowStock: 0 };
  salesStats = { today: 0, growth: 0 };
  lowStockCount: number = 0;
  topCategory: string = 'Cargando...';
  popularProducts: any[] = [];
  reminders: any[] = [];

  ngOnInit() {
    this.updateCurrentDate();
    this.loadDashboardData();
  }

  private updateCurrentDate() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.currentDate = now.toLocaleDateString('es-ES', options);
  }

  private loadDashboardData() {
    this.loading = true;
    
    // Simular carga de datos (reemplazar con tu API real)
    setTimeout(() => {
      this.totalProducts = 156;
      this.totalRevenue = 28450.75;
      this.inventoryStats = { total: 156, available: 142, lowStock: 8 };
      this.salesStats = { today: 23, growth: 15 };
      this.lowStockCount = 8;
      this.topCategory = 'Pasteles Decorados';
      this.popularProducts = [
        { name: 'Pastel de Fresa Decorado', icon: 'cake', sales: 45, stock: 8 },
        { name: 'Cupcakes de Vainilla', icon: 'cake', sales: 38, stock: 24 },
        { name: 'Helado de Chocolate', icon: 'cake', sales: 32, stock: 15 },
        { name: 'Galletas Decoradas', icon: 'cake', sales: 28, stock: 32 }
      ];
      this.loading = false;
    }, 1000);
  }

  formatCurrency(amount: number): string {
    return 'S/ ' + amount.toFixed(2);
  }

  // Método para obtener íconos de productos
  getProductIcon(iconName: string): any {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.cake;
  }
}