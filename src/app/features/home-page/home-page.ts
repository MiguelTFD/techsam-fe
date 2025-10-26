import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { 
  Package, ShoppingCart, TrendingUp, AlertTriangle, 
  Star, Cake, DollarSign, Users, Calendar, 
  ArrowUp, ArrowRight, CheckCircle, Clock
} from 'lucide-angular';
import { InventoryService, Product, Category } from '../../core/services/inventory.service';
import { DashboardService, Sale, PopularProduct, Reminder } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss']
})
export class HomePage implements OnInit {
  
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

  currentDate: string = '';
  loading: boolean = true;

  // Datos calculados
  totalProducts: number = 0;
  totalRevenue: number = 0;
  inventoryStats = { total: 0, available: 0, lowStock: 0 };
  salesStats = { today: 0, growth: 0 };
  lowStockCount: number = 0;
  topCategory: string = 'Cargando...';
  popularProducts: any[] = [];
  reminders: any[] = [];

  constructor(
    private inventoryService: InventoryService,
    private dashboardService: DashboardService
  ) {}

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

    // Usar los servicios para obtener datos crudos y calcular en frontend
    Promise.all([
      this.inventoryService.getProducts(1, 1000).toPromise(), // Todos los productos para cálculos
      this.dashboardService.getSales().toPromise(),
      this.inventoryService.getCategories().toPromise(),
      this.dashboardService.getTodaySales().toPromise(),
      this.inventoryService.getLowStockProducts().toPromise(),
      this.inventoryService.getOutOfStockProducts().toPromise()
    ]).then(([productsResponse, salesResponse, categoriesResponse, todaySalesResponse, lowStockResponse, outOfStockResponse]) => {
      
      const products = productsResponse?.data?.products || [];
      const allSales = salesResponse?.data || [];
      const categories = categoriesResponse?.data || [];
      const todaySales = todaySalesResponse?.data || [];
      const lowStockProducts = lowStockResponse?.data || [];
      const outOfStockProducts = outOfStockResponse?.data || [];

      this.calculateDashboardStats(products, allSales, categories, todaySales, lowStockProducts, outOfStockProducts);
      this.loading = false;
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.loading = false;
    });
  }

  private calculateDashboardStats(
    products: Product[], 
    allSales: Sale[], 
    categories: Category[], 
    todaySales: Sale[],
    lowStockProducts: Product[],
    outOfStockProducts: Product[]
  ) {
    // 1. Total de productos
    this.totalProducts = products.length;

    // 2. Revenue total (suma de todas las ventas)
    this.totalRevenue = allSales.reduce((sum, sale) => sum + sale.total, 0);

    // 3. Estadísticas de inventario
    this.inventoryStats.total = products.length;
    this.inventoryStats.available = products.filter(p => p.stock > 0).length;
    this.inventoryStats.lowStock = lowStockProducts.length;

    // 4. Ventas de hoy vs ayer (para crecimiento)
    this.calculateSalesGrowth(todaySales, allSales);

    // 5. Productos con stock bajo y agotados
    this.lowStockCount = lowStockProducts.length + outOfStockProducts.length;

    // 6. Categoría más popular (por ventas)
    this.topCategory = this.calculateTopCategory(allSales, categories);

    // 7. Productos más populares (por cantidad vendida)
    this.popularProducts = this.calculatePopularProducts(allSales, products);

    // 8. Recordatorios
    this.reminders = this.generateReminders(lowStockProducts, outOfStockProducts, todaySales);
  }

  private calculateSalesGrowth(todaySales: Sale[], allSales: Sale[]) {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayCount = todaySales.length;
    
    // Filtrar ventas de ayer
    const yesterdaySales = allSales.filter(sale => {
      const saleDate = new Date(sale.fecha_venta).toDateString();
      return saleDate === yesterday;
    });
    
    const yesterdayCount = yesterdaySales.length;

    this.salesStats.today = todayCount;
    
    // Calcular crecimiento en cantidad de ventas
    if (yesterdayCount > 0) {
      this.salesStats.growth = Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100);
    } else {
      this.salesStats.growth = todayCount > 0 ? 100 : 0;
    }
  }

  private calculateTopCategory(sales: Sale[], categories: Category[]): string {
    // Contar ventas por categoría
    const categorySales: { [key: string]: number } = {};
    
    sales.forEach(sale => {
      // Buscar nombre de categoría por id_categoria
      const category = categories.find(c => c.id_categoria === sale.id_categoria);
      const categoryName = category?.nombre_categoria || 'Sin categoría';
      
      categorySales[categoryName] = (categorySales[categoryName] || 0) + sale.total;
    });

    // Encontrar la categoría con más ventas
    let topCategory = 'Sin categoría';
    let maxSales = 0;

    Object.keys(categorySales).forEach(category => {
      if (categorySales[category] > maxSales) {
        maxSales = categorySales[category];
        topCategory = category;
      }
    });

    return topCategory;
  }

  private calculatePopularProducts(sales: Sale[], products: Product[]): any[] {
    // Contar cantidad vendida por producto
    const productSales: { [key: string]: { sales: number, product: Product } } = {};

    sales.forEach(sale => {
      if (!productSales[sale.id_producto]) {
        const product = products.find(p => p.id_producto === sale.id_producto);
        if (product) {
          productSales[sale.id_producto] = {
            sales: sale.cantidad,
            product: product
          };
        }
      } else {
        productSales[sale.id_producto].sales += sale.cantidad;
      }
    });

    // Ordenar por cantidad vendida y tomar top 4
    return Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4)
      .map(item => ({
        name: item.product.nombre_producto,
        icon: item.product.icon || 'cake',
        sales: item.sales,
        stock: item.product.stock,
        category: item.product.categoria
      }));
  }

  private generateReminders(lowStockProducts: Product[], outOfStockProducts: Product[], todaySales: Sale[]): any[] {
    const reminders = [];

    // Productos con stock bajo
    if (lowStockProducts.length > 0) {
      reminders.push({
        icon: this.icons.alertTriangle,
        text: `${lowStockProducts.length} productos con stock bajo`,
        time: 'Urgente',
        urgent: true
      });
    }

    // Productos sin stock
    if (outOfStockProducts.length > 0) {
      reminders.push({
        icon: this.icons.package,
        text: `${outOfStockProducts.length} productos agotados`,
        time: 'Pendiente',
        urgent: true
      });
    }

    // Ventas recientes (última hora)
    const oneHourAgo = new Date(Date.now() - 3600000);
    const recentSales = todaySales.filter(sale => new Date(sale.fecha_venta) > oneHourAgo);
    if (recentSales.length > 0) {
      reminders.push({
        icon: this.icons.trendingUp,
        text: `${recentSales.length} ventas en la última hora`,
        time: 'Reciente',
        urgent: false
      });
    }

    // Si no hay recordatorios, agregar uno genérico
    if (reminders.length === 0) {
      reminders.push({
        icon: this.icons.checkCircle,
        text: 'Todo está bajo control',
        time: 'Al día',
        urgent: false
      });
    }

    return reminders;
  }

  formatCurrency(amount: number): string {
    return 'S/ ' + amount.toFixed(2);
  }

  getProductIcon(iconName: string): any {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.cake;
  }
}