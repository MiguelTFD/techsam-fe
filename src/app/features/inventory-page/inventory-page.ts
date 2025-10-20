import { Component } from '@angular/core';
import { DataTable } from '../../shared/components/data-table/data-table';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';

@Component({
  selector: 'app-inventory-page',
  imports: [DataTable],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss'
})
export class InventoryPage {
  // Columnas basadas en tu tabla BD de productos
  columns: Column[] = [
    { key: 'id_producto', label: 'ID', sortable: true },
    { key: 'nombre_producto', label: 'Producto', sortable: true },
    { key: 'categoria', label: 'Categoría', sortable: true },
    { key: 'marca', label: 'Marca', sortable: true },
    { key: 'precio_venta', label: 'Precio (S/)', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
    { key: 'estado_stock', label: 'Estado', sortable: true }
  ];

  // Datos de ejemplo basados en tu estructura BD
  productsData: TableData[] = [
    { id_producto: 1, nombre_producto: 'Laptop HP Pavilion 15', categoria: 'Electrónicos', marca: 'HP', precio_venta: 899.99, stock: 15, estado_stock: 'Disponible' },
    { id_producto: 2, nombre_producto: 'Mouse Inalámbrico Logitech', categoria: 'Accesorios', marca: 'Logitech', precio_venta: 25.50, stock: 32, estado_stock: 'Disponible' },
    { id_producto: 3, nombre_producto: 'Teclado Mecánico RGB', categoria: 'Accesorios', marca: 'Redragon', precio_venta: 75.00, stock: 8, estado_stock: 'Bajo Stock' },
    { id_producto: 4, nombre_producto: 'Monitor 24" Samsung', categoria: 'Electrónicos', marca: 'Samsung', precio_venta: 199.99, stock: 0, estado_stock: 'Agotado' },
    { id_producto: 5, nombre_producto: 'Tablet Samsung Galaxy', categoria: 'Electrónicos', marca: 'Samsung', precio_venta: 299.99, stock: 12, estado_stock: 'Disponible' },
    { id_producto: 6, nombre_producto: 'Auriculares Bluetooth Sony', categoria: 'Accesorios', marca: 'Sony', precio_venta: 45.00, stock: 25, estado_stock: 'Disponible' },
    { id_producto: 7, nombre_producto: 'Cargador USB-C Rápido', categoria: 'Accesorios', marca: 'Anker', precio_venta: 15.99, stock: 3, estado_stock: 'Bajo Stock' },
    { id_producto: 8, nombre_producto: 'Disco Duro 1TB Seagate', categoria: 'Componentes', marca: 'Seagate', precio_venta: 59.99, stock: 18, estado_stock: 'Disponible' },
    { id_producto: 9, nombre_producto: 'Memoria RAM 8GB Kingston', categoria: 'Componentes', marca: 'Kingston', precio_venta: 39.99, stock: 0, estado_stock: 'Agotado' },
    { id_producto: 10, nombre_producto: 'Impresora Laser HP', categoria: 'Electrónicos', marca: 'HP', precio_venta: 189.99, stock: 6, estado_stock: 'Disponible' },
    { id_producto: 11, nombre_producto: 'Webcam HD 1080p', categoria: 'Accesorios', marca: 'Logitech', precio_venta: 35.00, stock: 14, estado_stock: 'Disponible' },
    { id_producto: 12, nombre_producto: 'Router WiFi TP-Link', categoria: 'Redes', marca: 'TP-Link', precio_venta: 79.99, stock: 9, estado_stock: 'Disponible' },
    { id_producto: 13, nombre_producto: 'SSD 500GB WD', categoria: 'Componentes', marca: 'Western Digital', precio_venta: 49.99, stock: 22, estado_stock: 'Disponible' },
    { id_producto: 14, nombre_producto: 'Monitor 27" LG', categoria: 'Electrónicos', marca: 'LG', precio_venta: 249.99, stock: 4, estado_stock: 'Bajo Stock' },
    { id_producto: 15, nombre_producto: 'Teclado Gaming Razer', categoria: 'Accesorios', marca: 'Razer', precio_venta: 89.99, stock: 7, estado_stock: 'Bajo Stock' }
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

  // Propiedades computadas para estadísticas
  get totalProductos(): number {
    return this.productsData.length;
  }

  get productosDisponibles(): number {
    return this.productsData.filter(p => p['stock'] > 0).length;
  }

  get productosAgotados(): number {
    return this.productsData.filter(p => p['stock'] === 0).length;
  }

  get productosBajoStock(): number {
    return this.productsData.filter(p => p['stock'] < 10 && p['stock'] > 0).length;
  }

  get valorTotalInventario(): number {
    return this.productsData.reduce((sum, product) => 
      sum + (parseFloat(product['precio_venta']) * product['stock']), 0
    );
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
    // Aquí ordenarías los datos
  }

  onRowClick(row: TableData) {
    console.log('📝 Producto seleccionado:', row);
    alert(`Producto: ${row['nombre_producto']}\nCategoría: ${row['categoria']}\nMarca: ${row['marca']}\nPrecio: S/ ${row['precio_venta']}\nStock: ${row['stock']} unidades`);
  }

  onAction(event: ActionEvent) {
    console.log('🔧 Acción en producto:', event.action, event.row);
    
    switch (event.action) {
      case 'edit':
        this.editProduct(event.row);
        break;
      case 'delete':
        this.deleteProduct(event.row);
        break;
    }
  }

  onAdd() {
    console.log('➕ Añadir nuevo producto');
    alert('Abrir formulario para nuevo producto');
  }

  private editProduct(product: any) {
    console.log('✏️ Editando producto:', product);
    alert(`Editando producto: ${product.nombre_producto}`);
  }

  private deleteProduct(product: any) {
    console.log('🗑️ Eliminando producto:', product);
    if (confirm(`¿Estás seguro de eliminar el producto "${product.nombre_producto}"?\nEsta acción no se puede deshacer.`)) {
      // Lógica para eliminar
      console.log('Producto eliminado:', product.id_producto);
    }
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
}