import { Component } from '@angular/core';
import { DataTable } from '../../shared/components/data-table/data-table';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';
import { ModalForm, FormField} from '../../shared/components/modal-form/modal-form';

@Component({
  selector: 'app-sales-page',
  imports: [DataTable, ModalForm],
  templateUrl: './sales-page.html',
  styleUrl: './sales-page.scss'
})
export class SalesPage {
  //Propiedades para exportar
  showExportButton: boolean = true;
  exportTitle: string = 'Reporte de Ventas';
  exportFileName: string = 'ventas';
  // AGREGAR ESTAS PROPIEDADES PARA EL MODAL DE VENTA
  showModal: boolean = false;
  modalLoading: boolean = false;
  modalTitle: string = 'Nueva Venta';
  
  // Productos disponibles para vender (en un caso real vendrían de tu API)
  availableProducts = [
    { value: 1, label: 'Laptop HP Pavilion 15 - S/ 899.99 (Stock: 15)', stock: 15, price: 899.99 },
    { value: 2, label: 'Mouse Inalámbrico Logitech - S/ 25.50 (Stock: 32)', stock: 32, price: 25.50 },
    { value: 3, label: 'Teclado Mecánico RGB - S/ 75.00 (Stock: 8)', stock: 8, price: 75.00 },
    { value: 4, label: 'Monitor 24" Samsung - S/ 199.99 (Stock: 0)', stock: 0, price: 199.99 },
    { value: 5, label: 'Tablet Samsung Galaxy - S/ 299.99 (Stock: 12)', stock: 12, price: 299.99 },
    { value: 6, label: 'Auriculares Bluetooth Sony - S/ 45.00 (Stock: 25)', stock: 25, price: 45.00 }
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
      label: 'Producto',
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
      key: 'observaciones',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
      placeholder: 'Notas adicionales de la venta...'
    }
  ];
  // Columnas basadas en tu tabla BD
  columns: Column[] = [
    { key: 'id_venta', label: 'ID Venta', sortable: true },
    { key: 'id_usuario', label: 'ID Usuario', sortable: true },
    { key: 'nombre_usuario', label: 'Vendedor', sortable: true },
    { key: 'fecha_venta', label: 'Fecha Venta', sortable: true },
    { key: 'total', label: 'Total (S/)', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  // Datos de ejemplo basados en tu estructura
  salesData: TableData[] = [
    { id_venta: 1, id_usuario: 101, nombre_usuario: 'Ana García', fecha_venta: '2024-01-15 10:30:00', total: 450.50, estado: 'Completada' },
    { id_venta: 2, id_usuario: 102, nombre_usuario: 'Carlos López', fecha_venta: '2024-01-15 11:15:00', total: 1200.00, estado: 'Completada' },
    { id_venta: 3, id_usuario: 103, nombre_usuario: 'María Torres', fecha_venta: '2024-01-15 14:20:00', total: 789.99, estado: 'Completada' },
    { id_venta: 4, id_usuario: 101, nombre_usuario: 'Ana García', fecha_venta: '2024-01-16 09:45:00', total: 2345.75, estado: 'Completada' },
    { id_venta: 5, id_usuario: 104, nombre_usuario: 'Juan Pérez', fecha_venta: '2024-01-16 12:30:00', total: 567.80, estado: 'Pendiente' },
    { id_venta: 6, id_usuario: 102, nombre_usuario: 'Carlos López', fecha_venta: '2024-01-16 15:10:00', total: 890.25, estado: 'Completada' },
    { id_venta: 7, id_usuario: 105, nombre_usuario: 'Laura Medina', fecha_venta: '2024-01-17 08:20:00', total: 1234.56, estado: 'Completada' },
    { id_venta: 8, id_usuario: 103, nombre_usuario: 'María Torres', fecha_venta: '2024-01-17 11:45:00', total: 678.90, estado: 'Cancelada' },
    { id_venta: 9, id_usuario: 101, nombre_usuario: 'Ana García', fecha_venta: '2024-01-17 16:30:00', total: 345.67, estado: 'Completada' },
    { id_venta: 10, id_usuario: 104, nombre_usuario: 'Juan Pérez', fecha_venta: '2024-01-18 10:00:00', total: 1567.89, estado: 'Completada' }
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
    return this.salesData.length;
  }

  get ventasCompletadas(): number {
    return this.salesData.filter(v => v['estado'] === 'Completada').length;
  }

  get totalIngresos(): number {
    return this.salesData
      .filter(v => v['estado'] === 'Completada')
      .reduce((sum, venta) => sum + parseFloat(venta['total']), 0);
  }

  get promedioVenta(): number {
    const ventasCompletadas = this.salesData.filter(v => v['estado'] === 'Completada');
    return ventasCompletadas.length > 0 
      ? this.totalIngresos / ventasCompletadas.length 
      : 0;
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
    // Aquí ordenarías los datos
  }

  onRowClick(row: TableData) {
    console.log('Venta seleccionada:', row);
    alert(`Venta #${row['id_venta']}\nVendedor: ${row['nombre_usuario']}\nTotal: S/ ${row['total']}\nEstado: ${row['estado']}`);
  }

  onAction(event: ActionEvent) {
    console.log('Acción en venta:', event.action, event.row);
    
    switch (event.action) {
      case 'edit':
        this.editSale(event.row);
        break;
      case 'delete':
        this.deleteSale(event.row);
        break;
    }
  }

  onAdd() {
    this.showModal = true;
  }
  // AGREGAR métodos para el modal
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
      // Encontrar nombres para mostrar en la tabla
      const vendedor = this.sellers.find(s => s.value == formData.id_usuario)?.label || 'Desconocido';
      const producto = this.availableProducts.find(p => p.value == formData.id_producto);
      
      if (!producto) {
        alert('❌ Error al procesar la venta');
        this.modalLoading = false;
        return;
      }

      const total = producto.price * cantidad;
      
      // Aquí llamarías a tu API para registrar la venta
      const newSale = {
        id_venta: this.salesData.length + 1,
        id_usuario: formData.id_usuario,
        nombre_usuario: vendedor,
        fecha_venta: new Date().toLocaleString('es-ES'),
        total: total,
        estado: 'Completada',
        // Datos adicionales para el detalle
        producto: producto.label.split(' - ')[0], // Solo el nombre del producto
        cantidad: cantidad,
        precio_unitario: producto.price
      };

      this.salesData.unshift(newSale);
      this.updateDisplayedData();
      
      this.modalLoading = false;
      this.showModal = false;
      
      alert(`✅ Venta registrada exitosamente\nTotal: S/ ${total.toFixed(2)}`);
    }, 1000);
  }

  onCancelModal() {
    this.showModal = false;
  }

  private editSale(venta: any) {
    console.log('✏️ Editando venta:', venta);
    alert(`Editando venta #${venta.id_venta}`);
  }

  private deleteSale(venta: any) {
    console.log('Eliminando venta:', venta);
    if (confirm(`¿Estás seguro de eliminar la venta #${venta.id_venta}?\nEsta acción no se puede deshacer.`)) {
      // Lógica para eliminar
      console.log('Venta eliminada:', venta.id_venta);
    }
  }

  // Formatear moneda
  formatCurrency(amount: number): string {
    return `S/ ${amount.toFixed(2)}`;
  }
}