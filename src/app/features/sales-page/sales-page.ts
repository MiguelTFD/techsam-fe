import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../shared/components/data-table/data-table';
import { StatsCards, StatCard } from '../../shared/components/stats-cards/stats-cards';
import { ExportButton } from '../../shared/components/export-button/export-button';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';
import { ModalForm, FormField} from '../../shared/components/modal-form/modal-form';
import { LucideAngularModule } from 'lucide-angular';
import { 
  ShoppingCart, Plus, TrendingUp, DollarSign, 
  CheckCircle, Clock, XCircle, Users, Package,
  Calendar, CreditCard, Gift, Award
} from 'lucide-angular';
import { SaleService, Sale, Product, User } from '../../core/services/sale.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-sales-page',
  imports: [
    DataTable, 
    ModalForm, 
    CommonModule, 
    LucideAngularModule,
    StatsCards,
    ExportButton
  ],
  templateUrl: './sales-page.html',
  styleUrl: './sales-page.scss'
})
export class SalesPage implements OnInit {
  private saleService = inject(SaleService);

  // Iconos para usar en el template
  icons = {
    shoppingCart: ShoppingCart,
    plus: Plus,
    trendingUp: TrendingUp,
    dollarSign: DollarSign,
    checkCircle: CheckCircle,
    clock: Clock,
    xCircle: XCircle,
    users: Users,
    package: Package,
    calendar: Calendar,
    creditCard: CreditCard,
    gift: Gift,
    award: Award
  };

  // Datos reales desde el backend
  salesData: TableData[] = [];
  displayedData: TableData[] = [];

  // ✅ ESTADÍSTICAS CONFIGURABLES PARA VENTAS
  stats: StatCard[] = [
    {
      value: 0,
      label: 'Total Ventas',
      icon: this.icons.shoppingCart,
      gradient: 'linear-gradient(135deg, #ff9cd9, #ff6bb8)'
    },
    {
      value: 0,
      label: 'Completadas',
      icon: this.icons.checkCircle,
      gradient: 'linear-gradient(135deg, #4ade80, #22c55e)'
    },
    {
      value: 0,
      label: 'Ingresos Totales',
      icon: this.icons.dollarSign,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      format: 'currency'
    },
    {
      value: 0,
      label: 'Ticket Promedio',
      icon: this.icons.trendingUp,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      format: 'currency'
    }
  ];

  // Propiedades para exportar
  showExportButton: boolean = true;
  exportTitle: string = 'Reporte de Ventas Dulces';
  exportFileName: string = 'ventas_dulces';
  
  // Propiedades para el modal de venta
  showModal: boolean = false;
  modalLoading: boolean = false;
  modalTitle: string = 'Nueva Venta';

  // Productos y vendedores desde el backend
  availableProducts: any[] = [];
  sellers: any[] = [];

  modalFields: FormField[] = [
    {
      key: 'id_usuario',
      label: 'Vendedor',
      type: 'select',
      required: true,
      options: this.sellers
    },
    {
      key: 'id_producto',
      label: 'Producto Dulce 🍭',
      type: 'select',
      required: true,
      options: this.availableProducts
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      type: 'number',
      required: true,
      placeholder: '1'
    },
    {
      key: 'metodo_pago',
      label: 'Método de Pago',
      type: 'select',
      required: true,
      options: [
        { value: 'efectivo', label: '💵 Efectivo' },
        { value: 'tarjeta', label: '💳 Tarjeta' },
        { value: 'transferencia', label: '🏦 Transferencia' },
        { value: 'yape', label: '📱 Yape' }
      ]
    },
    {
      key: 'observaciones',
      label: 'Observaciones Especiales',
      type: 'textarea',
      required: false,
      placeholder: 'Decoraciones especiales, mensajes, alergias...'
    }
  ];

  // Columnas para ventas de dulces
  columns: Column[] = [
    { key: 'id_venta', label: 'ID Venta', sortable: true },
    { key: 'nombre_usuario', label: 'Vendedor', sortable: true },
    { key: 'producto', label: 'Producto', sortable: true },
    { key: 'fecha_venta', label: 'Fecha', sortable: true },
    { key: 'total', label: 'Total (S/)', sortable: true },
    { key: 'metodo_pago', label: 'Pago', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  exportColumns = [
    { key: 'id_venta', label: 'ID Venta'},
    { key: 'nombre_usuario', label: 'Vendedor'},
    { key: 'producto', label: 'Producto'},
    { key: 'fecha_venta', label: 'Fecha'},
    { key: 'total', label: 'Total (S/)' },
    { key: 'metodo_pago', label: 'Pago'},
    { key: 'estado', label: 'Estado'}
  ]

  // Configuración
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 5,
    total: 0
  };
  
  loading: boolean = false;
  showActions: boolean = false;
  showAddButton: boolean = true;
  addButtonLabel: string = 'Nueva Venta';

  private allData: TableData[] = [];

  ngOnInit() {
    this.loadSales();
    this.loadStats();
    this.loadFormData();
  }

  private loadSales() {
    this.loading = true;
    this.saleService.getSales(this.pagination.page, this.pagination.pageSize)
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading sales:', error);
          alert('Error al cargar las ventas');
          return of({ data: { sales: [], total: 0 }, success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.salesData = response.data.sales;
          this.allData = [...this.salesData];
          this.pagination.total = response.data.total;
          this.updateDisplayedData();
        }
      });
  }

  private loadStats() {
    this.saleService.getSaleStats()
      .pipe(
        catchError(error => {
          console.error('Error loading sales stats:', error);
          return of({ 
            data: {
              totalVentas: 0,
              ventasCompletadas: 0,
              totalIngresos: 0,
              promedioVenta: 0,
              mejorVendedor: 'Sin ventas',
              ventasPendientes: 0
            }, 
            success: false, 
            message: '' 
          });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.updateStats(response.data);
        }
      });
  }

  private loadFormData() {
    // Cargar productos disponibles
    this.saleService.getAvailableProducts()
      .pipe(
        catchError(error => {
          console.error('Error loading products:', error);
          return of({ data: [], success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.availableProducts = response.data.map((product: Product) => ({
            value: product.id,
            label: `${product.nombre} - S/ ${product.precio.toFixed(2)} (Stock: ${product.stock})`,
            stock: product.stock,
            price: product.precio,
            icon: 'gift'
          }));
          this.updateProductField();
        }
      });

    // Cargar vendedores
    this.saleService.getSellers()
      .pipe(
        catchError(error => {
          console.error('Error loading sellers:', error);
          return of({ data: [], success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.sellers = response.data.map((user: User) => ({
            value: user.id,
            label: user.nombre
          }));
          this.updateSellerField();
        }
      });
  }

  private updateStats(statsData: any) {
    this.stats[0].value = statsData.totalVentas;
    this.stats[1].value = statsData.ventasCompletadas;
    this.stats[2].value = statsData.totalIngresos;
    this.stats[3].value = statsData.promedioVenta;
  }

  private updateProductField() {
    const productField = this.modalFields.find(field => field.key === 'id_producto');
    if (productField) {
      productField.options = this.availableProducts;
    }
  }

  private updateSellerField() {
    const sellerField = this.modalFields.find(field => field.key === 'id_usuario');
    if (sellerField) {
      sellerField.options = this.sellers;
    }
  }

  private updateDisplayedData() {
    const startIndex = (this.pagination.page - 1) * this.pagination.pageSize;
    const endIndex = startIndex + this.pagination.pageSize;
    this.displayedData = this.allData.slice(startIndex, endIndex);
  }

  // Manejar eventos de la tabla
  onPageChange(page: number) {
    this.pagination.page = page;
    this.loadSales();
  }

  onSearchChange(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.loadSales();
    } else {
      this.loading = true;
      this.saleService.getSales(1, this.pagination.pageSize, searchTerm)
        .pipe(
          finalize(() => this.loading = false),
          catchError(error => {
            console.error('Error searching sales:', error);
            alert('Error al buscar ventas');
            return of({ data: { sales: [], total: 0 }, success: false, message: '' });
          })
        )
        .subscribe(response => {
          if (response.success) {
            this.salesData = response.data.sales;
            this.allData = [...this.salesData];
            this.pagination.total = response.data.total;
            this.pagination.page = 1;
            this.updateDisplayedData();
          }
        });
    }
  }

  onSort(sortEvent: SortEvent) {
    console.log('🔄 Ordenando ventas por:', sortEvent);
    // Implementar lógica de ordenamiento si es necesario
  }

  onRowClick(row: TableData) {
    console.log('Venta seleccionada:', row);
    alert(`🎀 Venta #${row['id_venta']}\n👤 Vendedor: ${row['nombre_usuario']}\n🍰 Producto: ${row['producto']}\n💰 Total: S/ ${row['total']}\n💳 Método: ${this.getPaymentMethodLabel(row['metodo_pago'])}\n📊 Estado: ${row['estado']}`);
  }

  onAction(event: ActionEvent) {
    console.log('Acción en venta:', event.action, event.row);
  }

  onAdd() {
    this.showModal = true;
    // Recargar datos del formulario para tener información actualizada
    this.loadFormData();
  }

  onSaveSale(formData: any) {
    console.log('💾 Registrando venta:', formData);
    this.modalLoading = true;

    // Validar stock disponible
    const selectedProduct = this.availableProducts.find(p => p.value == formData.id_producto);
    const cantidad = parseInt(formData.cantidad);

    if (!selectedProduct) {
      alert('❌ Producto no encontrado');
      this.modalLoading = false;
      return;
    }

    if (cantidad > selectedProduct.stock) {
      alert(`❌ Stock insuficiente. Solo hay ${selectedProduct.stock} unidades disponibles`);
      this.modalLoading = false;
      return;
    }

    if (cantidad <= 0) {
      alert('❌ La cantidad debe ser mayor a 0');
      this.modalLoading = false;
      return;
    }

    // Crear venta en el backend
    const saleData = {
      id_usuario: formData.id_usuario,
      id_producto: formData.id_producto,
      cantidad: cantidad,
      metodo_pago: formData.metodo_pago,
      observaciones: formData.observaciones
    };

    this.saleService.createSale(saleData)
      .pipe(
        finalize(() => this.modalLoading = false),
        catchError(error => {
          console.error('Error creating sale:', error);
          alert('Error al registrar la venta');
          return of({ data: null, success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.showModal = false;
          const total = selectedProduct.price * cantidad;
          alert(`🎉 Venta registrada exitosamente!\n💰 Total: S/ ${total.toFixed(2)}\n🍰 ${cantidad} x ${selectedProduct.label.split(' - ')[0]}`);
          
          // Recargar datos
          this.loadSales();
          this.loadStats();
        } else {
          alert('Error al registrar la venta: ' + response.message);
        }
      });
  }

  onCancelModal() {
    this.showModal = false;
  }

  // Método para obtener etiqueta del método de pago
  getPaymentMethodLabel(metodo: string): string {
    const methods: { [key: string]: string } = {
      'efectivo': '💵 Efectivo',
      'tarjeta': '💳 Tarjeta',
      'transferencia': '🏦 Transferencia',
      'yape': '📱 Yape'
    };
    return methods[metodo] || metodo;
  }

  // Método para obtener el icono Lucide
  getSaleIcon(iconName: string): any {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.gift;
  }

  // Obtener clase CSS para el estado
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Completada': 'status-completed',
      'Pendiente': 'status-pending',
      'Cancelada': 'status-cancelled'
    };
    return statusClasses[status] || '';
  }

  // Obtener icono para el estado
  getStatusIcon(status: string): any {
    const statusIcons: { [key: string]: any } = {
      'Completada': this.icons.checkCircle,
      'Pendiente': this.icons.clock,
      'Cancelada': this.icons.xCircle
    };
    return statusIcons[status] || this.icons.clock;
  }

  // Formatear moneda
  formatCurrency(amount: number): string {
    return `S/ ${amount?.toFixed(2) || '0.00'}`;
  }

  // Formatear fecha
  formatDate(fecha: string): string {
    if (!fecha) return 'Fecha no disponible';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fecha;
    }
  }
}