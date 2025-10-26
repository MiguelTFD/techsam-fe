import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../shared/components/data-table/data-table';
import { StatsCards, StatCard } from '../../shared/components/stats-cards/stats-cards';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';
import { ModalForm, FormField} from '../../shared/components/modal-form/modal-form';
import { ExportButton } from '../../shared/components/export-button/export-button';
import { LucideAngularModule } from 'lucide-angular';
import { 
  Package, Plus, CakeSlice, IceCreamCone, Candy, Cake, 
  Coffee, Gift, ShoppingCart, TrendingUp, AlertTriangle, Award, Download
} from 'lucide-angular';
import { InventoryService, Product, Category, Brand } from '../../core/services/inventory.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-inventory-page',
  imports: [
    DataTable, 
    ModalForm, 
    CommonModule, 
    LucideAngularModule,
    StatsCards,
    ExportButton
  ],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss'
})
export class InventoryPage implements OnInit {
  private inventoryService = inject(InventoryService);

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

  // Datos reales desde el backend
  productsData: TableData[] = [];
  displayedData: TableData[] = [];

  stats: StatCard[] = [
    {
      value: 0,
      label: 'Total Productos',
      icon: this.icons.package,
      gradient: 'linear-gradient(135deg, #ff9cd9, #ff6bb8)'
    },
    {
      value: 0,
      label: 'Disponibles',
      icon: this.icons.trendingUp,
      gradient: 'linear-gradient(135deg, #4ade80, #22c55e)'
    },
    {
      value: 0,
      label: 'Bajo Stock',
      icon: this.icons.alertTriangle,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      value: 0,
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

  // Categorías y marcas desde el backend
  categories: any[] = [];
  brands: any[] = [];

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
      placeholder: '0.00',
      min: 0,
      step: 0.01
    },
    {
      key: 'stock',
      label: 'Stock Inicial',
      type: 'number',
      required: true,
      placeholder: '0',
      min: 0
    },
    {
      key: 'stock_minimo',
      label: 'Stock Mínimo',
      type: 'number',
      required: false,
      placeholder: '10 (valor por defecto)',
      min: 0
    },
    {
      key: 'descripcion',
      label: 'Descripción Adicional',
      type: 'textarea',
      required: false,
      placeholder: 'Ingredientes, sabores, decoraciones especiales...'
    }
  ];

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
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 5,
    total: 0
  };
  
  loading: boolean = false;
  showActions: boolean = true;
  showAddButton: boolean = true;
  addButtonLabel: string = 'Nuevo Producto';

  actions = [
    { name: 'edit', label: 'Editar', icon: 'edit2', color: 'blue' },
    { name: 'toggle', label: 'Activar/Desactivar', icon: 'toggleLeft', color: 'orange', confirm: true }
  ];

  private allData: TableData[] = [];

  ngOnInit() {
    this.loadProducts();
    this.loadStats();
    this.loadFormData();
  }

  private loadProducts() {
    this.loading = true;
    this.inventoryService.getProducts(this.pagination.page, this.pagination.pageSize)
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading products:', error);
          alert('Error al cargar los productos');
          return of({ data: { products: [], total: 0 }, success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.productsData = response.data.products.map(product => ({
            ...product,
            icon: this.getCategoryIcon(product.id_categoria)
          }));
          this.allData = [...this.productsData];
          this.pagination.total = response.data.total;
          this.updateDisplayedData();
        }
      });
  }

  private loadStats() {
    this.inventoryService.getInventoryStats()
      .pipe(
        catchError(error => {
          console.error('Error loading inventory stats:', error);
          return of({ 
            data: {
              totalProductos: 0,
              productosDisponibles: 0,
              productosAgotados: 0,
              productosBajoStock: 0,
              valorTotalInventario: 0,
              productoMasVendido: 'No hay productos'
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
    // Cargar categorías
    this.inventoryService.getCategories()
      .pipe(
        catchError(error => {
          console.error('Error loading categories:', error);
          return of({ data: [], success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.categories = response.data.map((category: Category) => ({
            value: category.id_categoria,
            label: category.nombre_categoria
          }));
          this.updateCategoryField();
        }
      });

    // Cargar marcas
    this.inventoryService.getBrands()
      .pipe(
        catchError(error => {
          console.error('Error loading brands:', error);
          return of({ data: [], success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.brands = response.data.map((brand: Brand) => ({
            value: brand.id_marca,
            label: brand.nombre_marca
          }));
          this.updateBrandField();
        }
      });
  }

  private updateStats(statsData: any) {
    this.stats[0].value = statsData.totalProductos;
    this.stats[1].value = statsData.productosDisponibles;
    this.stats[2].value = statsData.productosBajoStock;
    this.stats[3].value = statsData.valorTotalInventario;
  }

  private updateCategoryField() {
    const categoryField = this.modalFields.find(field => field.key === 'id_categoria');
    if (categoryField) {
      categoryField.options = this.categories;
    }
  }

  private updateBrandField() {
    const brandField = this.modalFields.find(field => field.key === 'id_marca');
    if (brandField) {
      brandField.options = this.brands;
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
    this.loadProducts();
  }

  onSearchChange(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.loadProducts();
    } else {
      this.loading = true;
      this.inventoryService.getProducts(1, this.pagination.pageSize, searchTerm)
        .pipe(
          finalize(() => this.loading = false),
          catchError(error => {
            console.error('Error searching products:', error);
            alert('Error al buscar productos');
            return of({ data: { products: [], total: 0 }, success: false, message: '' });
          })
        )
        .subscribe(response => {
          if (response.success) {
            this.productsData = response.data.products.map(product => ({
              ...product,
              icon: this.getCategoryIcon(product.id_categoria)
            }));
            this.allData = [...this.productsData];
            this.pagination.total = response.data.total;
            this.pagination.page = 1;
            this.updateDisplayedData();
          }
        });
    }
  }

  onSort(sortEvent: SortEvent) {
    console.log('🔄 Ordenando productos por:', sortEvent);
    // Implementar lógica de ordenamiento si es necesario
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
      this.inventoryService.toggleProductStatus(product.id_producto)
        .pipe(
          catchError(error => {
            console.error('Error toggling product status:', error);
            alert('Error al cambiar el estado del producto');
            return of({ data: null, success: false, message: '' });
          })
        )
        .subscribe(response => {
          if (response.success) {
            console.log(`✅ Producto ${action.toLowerCase()}:`, product.nombre_producto);
            alert(`Producto ${action.toLowerCase()} correctamente`);
            
            // Recargar datos
            this.loadProducts();
            this.loadStats();
          }
        });
    }
  }

  onAdd() {
    this.showModal = true;
    // Recargar datos del formulario para tener información actualizada
    this.loadFormData();
  }

  onSaveProduct(formData: any) {
    console.log('Guardando producto:', formData);
    this.modalLoading = true;

    // Validar datos
    if (formData.precio_venta <= 0) {
      alert('❌ El precio de venta debe ser mayor a 0');
      this.modalLoading = false;
      return;
    }

    if (formData.stock < 0) {
      alert('❌ El stock no puede ser negativo');
      this.modalLoading = false;
      return;
    }

    // Crear producto en el backend
    const productData = {
      nombre_producto: formData.nombre_producto,
      id_categoria: formData.id_categoria,
      id_marca: formData.id_marca,
      precio_venta: parseFloat(formData.precio_venta),
      stock: parseInt(formData.stock),
      stock_minimo: formData.stock_minimo ? parseInt(formData.stock_minimo) : 10,
      descripcion: formData.descripcion || ''
    };

    this.inventoryService.createProduct(productData)
      .pipe(
        finalize(() => this.modalLoading = false),
        catchError(error => {
          console.error('Error creating product:', error);
          alert('Error al crear el producto');
          return of({ data: null, success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.showModal = false;
          alert('🎉 Producto creado exitosamente! 🍰');
          
          // Recargar datos
          this.loadProducts();
          this.loadStats();
        } else {
          alert('Error al crear el producto: ' + response.message);
        }
      });
  }

  onCancelModal() {
    this.showModal = false;
  }

  private editProduct(product: any) {
    console.log('✏️ Editando producto:', product);
    // Aquí puedes implementar un modal de edición
    alert(`Editando producto: ${product.nombre_producto}`);
  }

  // Método para obtener icono según categoría
  getCategoryIcon(categoryId: number): string {
    const iconMap: { [key: number]: string } = {
      1: 'cake',      // Pasteles Decorados
      2: 'cupcake',   // Cupcakes
      3: 'iceCream',  // Helados Artesanales
      4: 'candy',     // Chocolates Finos
      5: 'gift',      // Galletas Decoradas
      6: 'cake',      // Postres Individuales
      7: 'coffee',    // Bebidas Dulces
      8: 'gift'       // Dulces Tradicionales
    };
    return iconMap[categoryId] || 'gift';
  }

  // Método para obtener el icono Lucide
  getProductIcon(iconName: string): any {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.gift;
  }

  // Formatear moneda
  formatCurrency(amount: number): string {
    return `S/ ${amount?.toFixed(2) || '0.00'}`;
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
      'Agotado': 'status-out',
      'Discontinuado': 'status-discontinued'
    };
    return statusClasses[status] || '';
  }

  // Obtener icono para el estado del stock
  getStockStatusIcon(status: string): any {
    const statusIcons: { [key: string]: any } = {
      'Disponible': this.icons.trendingUp,
      'Bajo Stock': this.icons.alertTriangle,
      'Agotado': this.icons.package,
      'Discontinuado': this.icons.alertTriangle
    };
    return statusIcons[status] || this.icons.package;
  }
}