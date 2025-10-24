import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../shared/components/data-table/data-table';
import { StatsCards, StatCard } from '../../shared/components/stats-cards/stats-cards';
import { FeaturedCard } from '../../shared/components/featured-card/featured-card';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';
import { ModalForm, FormField} from '../../shared/components/modal-form/modal-form';
import { LucideAngularModule } from 'lucide-angular';
import { 
  ShoppingCart, Plus, TrendingUp, DollarSign, 
  CheckCircle, Clock, XCircle, Users, Package,
  Calendar, CreditCard, Gift, Award
} from 'lucide-angular';

@Component({
  selector: 'app-sales-page',
  imports: [
    DataTable, 
    ModalForm, 
    CommonModule, 
    LucideAngularModule,
    StatsCards,
    FeaturedCard
  ],
  templateUrl: './sales-page.html',
  styleUrl: './sales-page.scss'
})
export class SalesPage implements OnInit{
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

  // ✅ INICIALIZAR salesData PRIMERO
  salesData: TableData[] = [
    { 
      id_venta: 1, 
      id_usuario: 101, 
      nombre_usuario: 'Ana García', 
      producto: 'Pastel de Fresa Decorado',
      fecha_venta: '2024-01-15 10:30:00', 
      total: 90.00, 
      metodo_pago: 'tarjeta',
      estado: 'Completada',
      cantidad: 2,
      icon: 'gift'
    },
    { 
      id_venta: 2, 
      id_usuario: 102, 
      nombre_usuario: 'Carlos López', 
      producto: 'Cupcakes de Vainilla',
      fecha_venta: '2024-01-15 11:15:00', 
      total: 75.00, 
      metodo_pago: 'efectivo',
      estado: 'Completada',
      cantidad: 6,
      icon: 'gift'
    },
    { 
      id_venta: 3, 
      id_usuario: 103, 
      nombre_usuario: 'María Torres', 
      producto: 'Helado de Chocolate',
      fecha_venta: '2024-01-15 14:20:00', 
      total: 54.00, 
      metodo_pago: 'yape',
      estado: 'Completada',
      cantidad: 3,
      icon: 'gift'
    },
    { 
      id_venta: 4, 
      id_usuario: 101, 
      nombre_usuario: 'Ana García', 
      producto: 'Cheesecake de Frutos Rojos',
      fecha_venta: '2024-01-16 09:45:00', 
      total: 44.00, 
      metodo_pago: 'transferencia',
      estado: 'Completada',
      cantidad: 2,
      icon: 'gift'
    },
    { 
      id_venta: 5, 
      id_usuario: 104, 
      nombre_usuario: 'Juan Pérez', 
      producto: 'Galletas con Glaseado',
      fecha_venta: '2024-01-16 12:30:00', 
      total: 25.50, 
      metodo_pago: 'efectivo',
      estado: 'Pendiente',
      cantidad: 3,
      icon: 'gift'
    },
    { 
      id_venta: 6, 
      id_usuario: 102, 
      nombre_usuario: 'Carlos López', 
      producto: 'Malteada de Fresa',
      fecha_venta: '2024-01-16 15:10:00', 
      total: 45.00, 
      metodo_pago: 'tarjeta',
      estado: 'Completada',
      cantidad: 3,
      icon: 'gift'
    },
    { 
      id_venta: 7, 
      id_usuario: 105, 
      nombre_usuario: 'Laura Medina', 
      producto: 'Brownie con Nuez',
      fecha_venta: '2024-01-17 08:20:00', 
      total: 22.50, 
      metodo_pago: 'yape',
      estado: 'Completada',
      cantidad: 3,
      icon: 'gift'
    },
    { 
      id_venta: 8, 
      id_usuario: 103, 
      nombre_usuario: 'María Torres', 
      producto: 'Trufas de Chocolate',
      fecha_venta: '2024-01-17 11:45:00', 
      total: 50.00, 
      metodo_pago: 'efectivo',
      estado: 'Cancelada',
      cantidad: 2,
      icon: 'gift'
    },
    { 
      id_venta: 9, 
      id_usuario: 101, 
      nombre_usuario: 'Ana García', 
      producto: 'Pastel de Fresa',
      fecha_venta: '2024-01-17 16:30:00', 
      total: 45.00, 
      metodo_pago: 'tarjeta',
      estado: 'Completada',
      cantidad: 1,
      icon: 'gift'
    },
    { 
      id_venta: 10, 
      id_usuario: 104, 
      nombre_usuario: 'Juan Pérez', 
      producto: 'Variedad de Cupcakes',
      fecha_venta: '2024-01-18 10:00:00', 
      total: 150.00, 
      metodo_pago: 'transferencia',
      estado: 'Completada',
      cantidad: 12,
      icon: 'gift'
    }
  ];

  // ✅ ESTADÍSTICAS CONFIGURABLES PARA VENTAS
  stats: StatCard[] = [
    {
      value: this.totalVentas,
      label: 'Total Ventas',
      icon: this.icons.shoppingCart,
      gradient: 'linear-gradient(135deg, #ff9cd9, #ff6bb8)'
    },
    {
      value: this.ventasCompletadas,
      label: 'Completadas',
      icon: this.icons.checkCircle,
      gradient: 'linear-gradient(135deg, #4ade80, #22c55e)'
    },
    {
      value: this.totalIngresos,
      label: 'Ingresos Totales',
      icon: this.icons.dollarSign,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      format: 'currency'
    },
    {
      value: this.promedioVenta,
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

  // Productos disponibles para vender - ahora de dulcería!
  availableProducts = [
    { value: 1, label: 'Pastel de Fresa Decorado - S/ 45.00 (Stock: 8)', stock: 8, price: 45.00, icon: 'gift' },
    { value: 2, label: 'Cupcakes de Vainilla - S/ 12.50 (Stock: 24)', stock: 24, price: 12.50, icon: 'gift' },
    { value: 3, label: 'Helado de Chocolate Belga - S/ 18.00 (Stock: 15)', stock: 15, price: 18.00, icon: 'gift' },
    { value: 4, label: 'Trufas de Chocolate Amargo - S/ 25.00 (Stock: 0)', stock: 0, price: 25.00, icon: 'gift' },
    { value: 5, label: 'Galletas con Glaseado - S/ 8.50 (Stock: 32)', stock: 32, price: 8.50, icon: 'gift' },
    { value: 6, label: 'Malteada de Fresa - S/ 15.00 (Stock: 20)', stock: 20, price: 15.00, icon: 'gift' },
    { value: 7, label: 'Cheesecake de Frutos Rojos - S/ 22.00 (Stock: 12)', stock: 12, price: 22.00, icon: 'gift' },
    { value: 8, label: 'Brownie con Nuez - S/ 7.50 (Stock: 28)', stock: 28, price: 7.50, icon: 'gift' }
  ];

  // Vendedores (usuarios)
  sellers = [
    { value: 101, label: 'Ana García' },
    { value: 102, label: 'Carlos López' },
    { value: 103, label: 'María Torres' },
    { value: 104, label: 'Juan Pérez' },
    { value: 105, label: 'Laura Medina' }
  ];

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
      options: this.availableProducts.map(p => ({
        value: p.value,
        label: p.label
      }))
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

  // Configuración
  displayedData: TableData[] = [];
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 5,
    total: this.salesData.length
  };
  
  loading: boolean = false;
  showActions: boolean = false;
  showAddButton: boolean = true;
  addButtonLabel: string = 'Nueva Venta';

  // Propiedades computadas para estadísticas
  get totalVentas(): number {
    return this.salesData?.length || 0;
  }

  get ventasCompletadas(): number {
    return this.salesData?.filter(v => v['estado'] === 'Completada').length || 0;
  }

  get ventasPendientes(): number {
    return this.salesData?.filter(v => v['estado'] === 'Pendiente').length || 0;
  }

  get totalIngresos(): number {
    return this.salesData
      ?.filter(v => v['estado'] === 'Completada')
      ?.reduce((sum, venta) => sum + parseFloat(venta['total']), 0) || 0;
  }

  get promedioVenta(): number {
    const ventasCompletadas = this.salesData?.filter(v => v['estado'] === 'Completada') || [];
    return ventasCompletadas.length > 0 
      ? this.totalIngresos / ventasCompletadas.length 
      : 0;
  }

  get mejorVendedor(): string {
    if (!this.salesData?.length) return 'Sin ventas';
    
    const ventasPorVendedor = this.salesData.reduce((acc, venta) => {
      if (venta['estado'] === 'Completada') {
        acc[venta['nombre_usuario']] = (acc[venta['nombre_usuario']] || 0) + parseFloat(venta['total']);
      }
      return acc;
    }, {} as { [key: string]: number });

    const mejor = Object.entries(ventasPorVendedor).reduce((prev, current) => 
      (prev[1] > current[1]) ? prev : current, ['', 0]
    );

    return mejor[0] || 'Sin ventas';
  }

  ngOnInit() {
    this.allData = [...this.salesData];
    this.updateDisplayedData();
  }

  private allData: TableData[] = [];

  private updateDisplayedData() {
    const startIndex = (this.pagination.page - 1) * this.pagination.pageSize;
    const endIndex = startIndex + this.pagination.pageSize;
    this.displayedData = this.allData.slice(startIndex, endIndex);
  }

  // Manejar eventos de la tabla
  onPageChange(page: number) {
    this.pagination.page = page;
    this.updateDisplayedData();
  }

  onSearchChange(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.allData = [...this.salesData];
    } else {
      this.allData = this.salesData.filter(venta =>
        venta['nombre_usuario'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        venta['producto'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        venta['id_venta'].toString().includes(searchTerm) ||
        venta['estado'].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.pagination.total = this.allData.length;
    this.pagination.page = 1;
    this.updateDisplayedData();
  }

  onSort(sortEvent: SortEvent) {
    console.log('🔄 Ordenando ventas por:', sortEvent);
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

    // Simular registro de venta
    setTimeout(() => {
      const vendedor = this.sellers.find(s => s.value == formData.id_usuario)?.label || 'Desconocido';
      const producto = this.availableProducts.find(p => p.value == formData.id_producto);
      
      if (!producto) {
        alert('❌ Error al procesar la venta');
        this.modalLoading = false;
        return;
      }

      const total = producto.price * cantidad;
      
      // Registrar la venta
      const newSale = {
        id_venta: this.salesData.length + 1,
        id_usuario: formData.id_usuario,
        nombre_usuario: vendedor,
        producto: producto.label.split(' - ')[0],
        fecha_venta: new Date().toLocaleString('es-ES'),
        total: total,
        metodo_pago: formData.metodo_pago,
        estado: 'Completada',
        cantidad: cantidad,
        precio_unitario: producto.price,
        icon: 'gift'
      };

      this.salesData.unshift(newSale);
      this.updateDisplayedData();
      
      this.modalLoading = false;
      this.showModal = false;
      
      alert(`🎉 Venta registrada exitosamente!\n💰 Total: S/ ${total.toFixed(2)}\n🍰 ${cantidad} x ${producto.label.split(' - ')[0]}`);
    }, 1000);
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
    return `S/ ${amount.toFixed(2)}`;
  }

  // Formatear fecha
  formatDate(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}