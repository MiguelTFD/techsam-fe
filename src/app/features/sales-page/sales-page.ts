import { Component } from '@angular/core';
import { DataTable } from '../../shared/components/data-table/data-table';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';

@Component({
  selector: 'app-sales-page',
  imports: [DataTable],
  templateUrl: './sales-page.html',
  styleUrl: './sales-page.scss'
})
export class SalesPage {
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
  showActions: boolean = true;
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
    console.log('📝 Venta seleccionada:', row);
    alert(`Venta #${row['id_venta']}\nVendedor: ${row['nombre_usuario']}\nTotal: S/ ${row['total']}\nEstado: ${row['estado']}`);
  }

  onAction(event: ActionEvent) {
    console.log('🔧 Acción en venta:', event.action, event.row);
    
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
    console.log('➕ Crear nueva venta');
    alert('Abrir formulario para nueva venta');
  }

  private editSale(venta: any) {
    console.log('✏️ Editando venta:', venta);
    alert(`Editando venta #${venta.id_venta}`);
  }

  private deleteSale(venta: any) {
    console.log('🗑️ Eliminando venta:', venta);
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