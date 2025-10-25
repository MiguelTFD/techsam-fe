import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../shared/components/data-table/data-table';
import { StatsCards, StatCard } from '../../shared/components/stats-cards/stats-cards';
import { FeaturedCard } from '../../shared/components/featured-card/featured-card';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';
import { ModalForm, FormField} from '../../shared/components/modal-form/modal-form';
import { ExportButton } from '../../shared/components/export-button/export-button';
import { LucideAngularModule } from 'lucide-angular';
import { 
  Package, Plus, CakeSlice, IceCreamCone, Candy, Cake, 
  Coffee, Gift, ShoppingCart, TrendingUp, AlertTriangle, Award, Download
} from 'lucide-angular';

@Component({
  selector: 'app-inventory-page',
  imports: [
    DataTable, 
    ModalForm, 
    CommonModule, 
    LucideAngularModule,
    StatsCards,
    FeaturedCard,
    ExportButton
  ],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss'
})
export class InventoryPage implements OnInit {
  // Iconos para usar en el template
  icons = {
    package: Package,
    plus: Plus,
    cupcake: CakeSlice,
    iceCream: IceCreamCone,
    candy: Candy,
    cake: Cake,
    coffee: Coffee,
    gift: Gift,
    shoppingCart: ShoppingCart,
    trendingUp: TrendingUp,
    alertTriangle: AlertTriangle,
    award: Award,
    download: Download
  };

  // ✅ INICIALIZAR productsData PRIMERO
  productsData: TableData[] = [
    { 
      id_producto: 1, 
      nombre_producto: 'Pastel de Fresa Decorado', 
      categoria: 'Pasteles Decorados', 
      marca: 'Pastelería Mágica', 
      precio_venta: 45.00, 
      stock: 8, 
      estado_stock: 'Disponible',
      icon: 'cake'
    },
    { 
      id_producto: 2, 
      nombre_producto: 'Cupcakes de Vainilla con Sprinkles', 
      categoria: 'Cupcakes', 
      marca: 'Dulce Corazón', 
      precio_venta: 12.50, 
      stock: 24, 
      estado_stock: 'Disponible',
      icon: 'cupcake'
    },
    { 
      id_producto: 3, 
      nombre_producto: 'Helado de Chocolate Belga', 
      categoria: 'Helados Artesanales', 
      marca: 'Heladería Artesanal', 
      precio_venta: 18.00, 
      stock: 15, 
      estado_stock: 'Disponible',
      icon: 'iceCream'
    },
    { 
      id_producto: 4, 
      nombre_producto: 'Trufas de Chocolate Amargo', 
      categoria: 'Chocolates Finos', 
      marca: 'Chocolatería Finita', 
      precio_venta: 25.00, 
      stock: 0, 
      estado_stock: 'Agotado',
      icon: 'candy'
    },
    { 
      id_producto: 5, 
      nombre_producto: 'Galletas con Glaseado de Colores', 
      categoria: 'Galletas Decoradas', 
      marca: 'Galletas Encantadas', 
      precio_venta: 8.50, 
      stock: 32, 
      estado_stock: 'Disponible',
      icon: 'gift'
    },
    { 
      id_producto: 6, 
      nombre_producto: 'Malteada de Fresa con Crema', 
      categoria: 'Bebidas Dulces', 
      marca: 'Dulce Corazón', 
      precio_venta: 15.00, 
      stock: 20, 
      estado_stock: 'Disponible',
      icon: 'coffee'
    },
    { 
      id_producto: 7, 
      nombre_producto: 'Alfajores Tradicionales', 
      categoria: 'Dulces Tradicionales', 
      marca: 'Dulces Tradicionales', 
      precio_venta: 6.00, 
      stock: 3, 
      estado_stock: 'Bajo Stock',
      icon: 'gift'
    },
    { 
      id_producto: 8, 
      nombre_producto: 'Cheesecake de Frutos Rojos', 
      categoria: 'Postres Individuales', 
      marca: 'Postres Gourmet', 
      precio_venta: 22.00, 
      stock: 12, 
      estado_stock: 'Disponible',
      icon: 'cake'
    },
    { 
      id_producto: 9, 
      nombre_producto: 'Chocolate con Almendras', 
      categoria: 'Chocolates Finos', 
      marca: 'Chocolatería Finita', 
      precio_venta: 18.50, 
      stock: 0, 
      estado_stock: 'Agotado',
      icon: 'candy'
    },
    { 
      id_producto: 10, 
      nombre_producto: 'Helado de Vainilla Madagascar', 
      categoria: 'Helados Artesanales', 
      marca: 'Heladería Artesanal', 
      precio_venta: 16.00, 
      stock: 5, 
      estado_stock: 'Bajo Stock',
      icon: 'iceCream'
    },
    { 
      id_producto: 11, 
      nombre_producto: 'Pastelito de Manzana Canela', 
      categoria: 'Postres Individuales', 
      marca: 'Repostería Creativa', 
      precio_venta: 9.00, 
      stock: 18, 
      estado_stock: 'Disponible',
      icon: 'cake'
    },
    { 
      id_producto: 12, 
      nombre_producto: 'Café Helado con Caramelo', 
      categoria: 'Bebidas Dulces', 
      marca: 'Dulce Corazón', 
      precio_venta: 14.00, 
      stock: 25, 
      estado_stock: 'Disponible',
      icon: 'coffee'
    },
    { 
      id_producto: 13, 
      nombre_producto: 'Brownie con Nuez', 
      categoria: 'Postres Individuales', 
      marca: 'Repostería Creativa', 
      precio_venta: 7.50, 
      stock: 28, 
      estado_stock: 'Disponible',
      icon: 'cake'
    },
    { 
      id_producto: 14, 
      nombre_producto: 'Cupcakes de Red Velvet', 
      categoria: 'Cupcakes', 
      marca: 'Pastelería Mágica', 
      precio_venta: 13.00, 
      stock: 2, 
      estado_stock: 'Bajo Stock',
      icon: 'cupcake'
    },
    { 
      id_producto: 15, 
      nombre_producto: 'Galletas de Mantequilla', 
      categoria: 'Galletas Decoradas', 
      marca: 'Galletas Encantadas', 
      precio_venta: 5.50, 
      stock: 40, 
      estado_stock: 'Disponible',
      icon: 'gift'
    }
  ];

  // ✅ ESTADÍSTICAS CONFIGURABLES PARA INVENTARIO
  stats: StatCard[] = [
    {
      value: this.totalProductos,
      label: 'Total Productos',
      icon: this.icons.package,
      gradient: 'linear-gradient(135deg, #ff9cd9, #ff6bb8)'
    },
    {
      value: this.productosDisponibles,
      label: 'Disponibles',
      icon: this.icons.trendingUp,
      gradient: 'linear-gradient(135deg, #4ade80, #22c55e)'
    },
    {
      value: this.productosBajoStock,
      label: 'Bajo Stock',
      icon: this.icons.alertTriangle,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      value: this.valorTotalInventario,
      label: 'Valor Total',
      icon: this.icons.shoppingCart,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      format: 'currency'
    }
  ];

  // Propiedades para exportar
  showExportButton: boolean = true;
  exportTitle: string = 'Reporte de Inventario de Dulces';
  exportFileName: string = 'inventario_dulces';
  
  // Propiedades para el modal
  showModal: boolean = false;
  modalLoading: boolean = false;
  modalTitle: string = 'Nuevo Producto';

  // Datos para los selects - ahora de dulces!
  categories = [
    { value: 1, label: 'Pasteles Decorados' },
    { value: 2, label: 'Cupcakes' },
    { value: 3, label: 'Helados Artesanales' },
    { value: 4, label: 'Chocolates Finos' },
    { value: 5, label: 'Galletas Decoradas' },
    { value: 6, label: 'Postres Individuales' },
    { value: 7, label: 'Bebidas Dulces' },
    { value: 8, label: 'Dulces Tradicionales' }
  ];

  brands = [
    { value: 1, label: 'Dulce Corazón' },
    { value: 2, label: 'Pastelería Mágica' },
    { value: 3, label: 'Chocolatería Finita' },
    { value: 4, label: 'Heladería Artesanal' },
    { value: 5, label: 'Repostería Creativa' },
    { value: 6, label: 'Dulces Tradicionales' },
    { value: 7, label: 'Postres Gourmet' },
    { value: 8, label: 'Galletas Encantadas' }
  ];

  modalFields: FormField[] = [
    {
      key: 'nombre_producto',
      label: 'Nombre del Producto',
      type: 'text',
      required: true,
      placeholder: 'Ej: Pastel de Fresa Decorado'
    },
    {
      key: 'id_categoria',
      label: 'Categoría',
      type: 'select',
      required: true,
      options: this.categories
    },
    {
      key: 'id_marca',
      label: 'Marca',
      type: 'select',
      required: true,
      options: this.brands
    },
    {
      key: 'precio_venta',
      label: 'Precio de Venta (S/)',
      type: 'number',
      required: true,
      placeholder: '0.00'
    },
    {
      key: 'stock',
      label: 'Stock Inicial',
      type: 'number',
      required: true,
      placeholder: '0'
    },
    {
      key: 'descripcion',
      label: 'Descripción Adicional',
      type: 'textarea',
      required: false,
      placeholder: 'Ingredientes, sabores, decoraciones especiales...'
    }
  ];

  // Columnas para productos dulces
  columns: Column[] = [
    { key: 'id_producto', label: 'ID', sortable: true },
    { key: 'nombre_producto', label: 'Producto', sortable: true },
    { key: 'categoria', label: 'Categoría', sortable: true },
    { key: 'marca', label: 'Marca', sortable: true },
    { key: 'precio_venta', label: 'Precio (S/)', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
    { key: 'estado_stock', label: 'Estado', sortable: true }
  ];

  exportColumns = [
    { key: 'id_producto', label: 'ID' },
    { key: 'nombre_producto', label: 'Producto' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'marca', label: 'Marca' },
    { key: 'precio_venta', label: 'Precio (S/)' },
    { key: 'stock', label: 'Stock' },
    { key: 'estado_stock', label: 'Estado' }
  ];


  // Configuración
  displayedData: TableData[] = [];
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 5,
    total: this.productsData.length
  };
  
  loading: boolean = false;
  showActions: boolean = true;
  showAddButton: boolean = true;
  addButtonLabel: string = 'Nuevo Producto';

  actions = [
    { name: 'edit', label: 'Editar', icon: '✏️', color: 'blue' },
    { name: 'toggle', label: 'Discontinuar', icon: '🚫', color: 'red', confirm: true, dangerous: true }
  ];


  // Propiedades computadas para estadísticas
  get totalProductos(): number {
    return this.productsData?.length || 0;
  }

  get productosDisponibles(): number {
    return this.productsData?.filter(p => p['stock'] > 0).length || 0;
  }

  get productosAgotados(): number {
    return this.productsData?.filter(p => p['stock'] === 0).length || 0;
  }

  get productosBajoStock(): number {
    return this.productsData?.filter(p => p['stock'] < 10 && p['stock'] > 0).length || 0;
  }

  get valorTotalInventario(): number {
    return this.productsData?.reduce((sum, product) => 
      sum + (parseFloat(product['precio_venta']) * product['stock']), 0
    ) || 0;
  }

  get productoMasVendido(): string {
    if (!this.productsData?.length) return 'No hay productos';
    const top = this.productsData.reduce((prev, current) => 
      (prev['stock'] < current['stock']) ? prev : current // El que menos stock tiene podría ser el más vendido
    );
    return top['nombre_producto'];
  }

  ngOnInit() {
    this.allData = [...this.productsData];
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
      this.allData = [...this.productsData];
    } else {
      this.allData = this.productsData.filter(product =>
        product['nombre_producto'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        product['categoria'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        product['marca'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        product['id_producto'].toString().includes(searchTerm)
      );
    }
    this.pagination.total = this.allData.length;
    this.pagination.page = 1;
    this.updateDisplayedData();
  }

  onSort(sortEvent: SortEvent) {
    console.log('🔄 Ordenando productos por:', sortEvent);
  }

  onRowClick(row: TableData) {
    console.log('Producto seleccionado:', row);
    alert(`🍰 Producto: ${row['nombre_producto']}\n🎀 Categoría: ${row['categoria']}\n⭐ Marca: ${row['marca']}\n💰 Precio: S/ ${row['precio_venta']}\n📦 Stock: ${row['stock']} unidades`);
  }

  onAction(event: ActionEvent) {
    console.log('🔧 Acción en producto:', event.action, event.row);
    
    switch (event.action) {
      case 'edit':
        this.editProduct(event.row);
        break;
      case 'toggle':
        this.toggleProduct(event.row);
        break;
    }
  }

  private toggleProduct(product: any) {
    const action = product.estado_stock === 'Discontinuado' ? 'Reactivar' : 'Discontinuar';
    
    if (confirm(`¿${action} el producto "${product.nombre_producto}"?`)) {
      console.log(`✅ Producto ${action.toLowerCase()}:`, product.nombre_producto);
      alert(`Producto ${action.toLowerCase()} correctamente`);
    }
  }

  onAdd() {
     this.showModal = true;
  }

  onSaveProduct(formData: any) {
    console.log('Guardando producto:', formData);
    this.modalLoading = true;

    setTimeout(() => {
      const categoria = this.categories.find(c => c.value == formData.id_categoria)?.label || 'Desconocida';
      const marca = this.brands.find(b => b.value == formData.id_marca)?.label || 'Desconocida';
      
      const newProduct = {
        id_producto: this.productsData.length + 1,
        nombre_producto: formData.nombre_producto,
        categoria: categoria,
        marca: marca,
        precio_venta: parseFloat(formData.precio_venta),
        stock: parseInt(formData.stock),
        estado_stock: this.getStockStatus(parseInt(formData.stock)),
        icon: this.getCategoryIcon(formData.id_categoria),
        id_categoria: formData.id_categoria,
        id_marca: formData.id_marca,
        descripcion: formData.descripcion || ''
      };

      this.productsData.unshift(newProduct);
      this.updateDisplayedData();
      
      this.modalLoading = false;
      this.showModal = false;
      
      alert('🎉 Producto creado exitosamente! 🍰');
    }, 1000);
  }

  onCancelModal() {
    this.showModal = false;
  }

  private editProduct(product: any) {
    console.log('✏️ Editando producto:', product);
    alert(`Editando producto: ${product.nombre_producto}`);
  }

  // Método para obtener icono según categoría
  getCategoryIcon(categoryId: number): string {
    const iconMap: { [key: number]: string } = {
      1: 'cake',
      2: 'cupcake', 
      3: 'iceCream',
      4: 'candy',
      5: 'gift',
      6: 'cake',
      7: 'coffee',
      8: 'gift'
    };
    return iconMap[categoryId] || 'gift';
  }

  // Método para obtener el icono Lucide
  getProductIcon(iconName: string): any {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.gift;
  }

  // Formatear moneda
  formatCurrency(amount: number): string {
    return `S/ ${amount.toFixed(2)}`;
  }

  // Determinar estado del stock
  getStockStatus(stock: number): string {
    if (stock === 0) return 'Agotado';
    if (stock < 10) return 'Bajo Stock';
    return 'Disponible';
  }

  // Obtener clase CSS para el estado del stock
  getStockStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Disponible': 'status-available',
      'Bajo Stock': 'status-low',
      'Agotado': 'status-out'
    };
    return statusClasses[status] || '';
  }
}