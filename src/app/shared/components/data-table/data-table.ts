// data-table/data-table.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column, TableData, SortEvent, PaginationConfig, SearchConfig, Action, ActionEvent } from './types';
import { ExportButton } from '../export-button/export-button';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ExportButton],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.scss']
})
export class DataTable implements OnInit, OnChanges {
  @Input() columns: Column[] = [];
  @Input() data: TableData[] = [];
  @Input() loading: boolean = false;
  @Input() pagination: PaginationConfig = { page: 1, pageSize: 10, total: 0 };
  @Input() search: SearchConfig = { placeholder: 'Buscar...', debounceTime: 300 };
  @Input() showActions: boolean = true;
  @Input() actions: Action[] = [];
  @Input() showAddButton: boolean = true;
  @Input() addButtonLabel: string = 'Añadir Nuevo';
//Inputs para exportar
  @Input() showExportButton: boolean = false;
  @Input() exportTitle: string = 'Reporte';
  @Input() exportFileName: string = 'reporte';
  @Input() exportStats: any = {};
  
  @Output() export = new EventEmitter<void>();
  
  @Output() action = new EventEmitter<ActionEvent>();
  @Output() add = new EventEmitter<void>();
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() rowClick = new EventEmitter<TableData>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() searchChange = new EventEmitter<string>();

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';
  private searchTimeout: any;

  // OnInit: Se ejecuta cuando el componente se inicializa
  ngOnInit() {
    console.log('🚀 DataTable inicializado');
    console.log('🔍 DataTable - showExportButton:', this.showExportButton);
    console.log('🔍 DataTable - columns:', this.columns);
    console.log('🔍 DataTable - data length:', this.data.length);
    
    // Inicializaciones que solo se hacen una vez
    this.initializeDefaultSort();
    this.validateColumns();
  }

  // OnChanges: Se ejecuta cuando cambian los inputs
  ngOnChanges(changes: SimpleChanges) {
    console.log('🔄 Cambios detectados en DataTable');

    // Cuando cambian los datos (ej: después de una venta)
    if (changes['data']) {
      console.log('📦 Datos actualizados:', this.data.length, 'registros');
      this.handleDataChange(changes['data']);
    }

    // Cuando cambia la paginación
    if (changes['pagination']) {
      console.log('📄 Paginación actualizada:', this.pagination);
      this.handlePaginationChange(changes['pagination']);
    }

    // Cuando cambia el estado de loading
    if (changes['loading']) {
      console.log('⏳ Estado loading:', this.loading);
    }

    // Cuando cambian las columnas
    if (changes['columns']) {
      console.log('🎯 Columnas actualizadas:', this.columns.length, 'columnas');
      this.validateColumns();
    }
  }

  // Métodos privados para manejar cambios específicos
  private initializeDefaultSort() {
    // Si hay columnas sortables, seleccionar la primera por defecto
    const sortableColumn = this.columns.find(col => col.sortable);
    if (sortableColumn) {
      this.sortColumn = sortableColumn.key;
      this.sortDirection = 'asc';
    }
  }

  private validateColumns() {
    if (!this.columns || this.columns.length === 0) {
      console.warn('⚠️ DataTable: No se han definido columnas');
    }
  }

  private handleDataChange(change: SimpleChanges['data']) {
    const previousData = change.previousValue || [];
    const currentData = change.currentValue || [];
    
    // Verificar si realmente hubo un cambio en los datos
    if (previousData.length !== currentData.length) {
      console.log(`📊 Cambio en cantidad de datos: ${previousData.length} → ${currentData.length}`);
    }

    // Si los datos están vacíos y había datos antes, podría indicar un problema
    if (previousData.length > 0 && currentData.length === 0 && !this.loading) {
      console.warn('⚠️ DataTable: Los datos se vaciaron inesperadamente');
    }
  }

  private handlePaginationChange(change: SimpleChanges['pagination']) {
    const previousPagination = change.previousValue;
    const currentPagination = change.currentValue;

    // Validar que la página actual esté dentro del rango válido
    if (currentPagination.page > this.totalPages && this.totalPages > 0) {
      console.warn('⚠️ Página fuera de rango, ajustando a la última página disponible');
      this.pageChange.emit(this.totalPages);
    }
  }

  // Paginación
  get totalPages(): number {
    return Math.ceil(this.pagination.total / this.pagination.pageSize);
  }

  get visiblePages(): number[] {
    const pages = [];
    const current = this.pagination.page;
    const total = this.totalPages;
    
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }
    return pages;
  }

   // AGREGAR estas propiedades computadas para el template
  get displayRangeStart(): number {
    return (this.pagination.page - 1) * this.pagination.pageSize + 1;
  }

  get displayRangeEnd(): number {
    return Math.min(this.pagination.page * this.pagination.pageSize, this.pagination.total);
  }

  onAdd() {
    console.log('➕ Botón añadir clickeado');
    this.add.emit();
  }

  onAction(actionName: string, row: TableData, event: Event) {
    event.stopPropagation(); // Importante: evita que se active el click de la fila
    console.log('🔧 Acción:', actionName, 'en fila:', row);
    this.action.emit({ 
      action: actionName, 
      row: row 
    });
  }

  onSearchChange() {
    // Debounce para no hacer muchas llamadas
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchChange.emit(this.searchTerm);
    }, this.search.debounceTime);
  }

  onSort(column: Column) {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.sort.emit({
      column: this.sortColumn,
      direction: this.sortDirection
    });
  }

  onRowClick(row: TableData) {
    this.rowClick.emit(row);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.pagination.page) {
      this.pageChange.emit(page);
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchChange.emit('');
  }
}