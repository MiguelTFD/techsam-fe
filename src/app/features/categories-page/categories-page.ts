import { Component } from '@angular/core';
import { DataTable } from '../../shared/components/data-table/data-table';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent} from '../../shared/components/data-table/types';

@Component({
  selector: 'app-categories-page',
  imports: [DataTable],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss'
})
export class CategoriesPage {
  // Columnas específicas para categorías
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripción', sortable: true },
    { key: 'productCount', label: 'Productos', sortable: true },
    { key: 'status', label: 'Estado', sortable: true }
  ];

  // Datos de ejemplo para categorías
  categoriesData: TableData[] = [
    { id: 1, name: 'Electrónicos', description: 'Dispositivos electrónicos y gadgets', productCount: 15, status: 'Activo' },
    { id: 2, name: 'Accesorios', description: 'Accesorios para computadora', productCount: 8, status: 'Activo' },
    { id: 3, name: 'Componentes', description: 'Partes de hardware interno', productCount: 12, status: 'Activo' },
    { id: 4, name: 'Software', description: 'Programas y aplicaciones', productCount: 0, status: 'Inactivo' },
    { id: 5, name: 'Muebles', description: 'Mobiliario para oficina', productCount: 5, status: 'Activo' },
    { id: 6, name: 'Impresión', description: 'Suministros de impresión', productCount: 7, status: 'Activo' },
    { id: 7, name: 'Redes', description: 'Equipos de networking', productCount: 3, status: 'Activo' },
    { id: 8, name: 'Almacenamiento', description: 'Discos y memorias', productCount: 9, status: 'Activo' }
  ];

  // Configuración
  displayedData: TableData[] = [];
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 5,
    total: this.categoriesData.length
  };
  
  loading: boolean = false;
  showActions: boolean = true;
  actions = [
    { name: 'edit', label: 'Editar', icon: '✏️', color: 'blue' },
    { name: 'toggle', label: 'Activar/Desactivar', icon: '🔁', color: 'orange', confirm: true }
  ];
  showAddButton: boolean = true;
  addButtonLabel: string = 'Nueva Categoría';

  // Propiedades computadas para estadísticas
  get totalCategories(): number {
    return this.categoriesData.length;
  }

  get activeCategories(): number {
    return this.categoriesData.filter(c => c['status'] === 'Activo').length;
  }

  get categoriesWithProducts(): number {
    return this.categoriesData.filter(c => c['productCount'] > 0).length;
  }

  ngOnInit() {
    this.allData = [...this.categoriesData];
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
      this.allData = [...this.categoriesData];
    } else {
      this.allData = this.categoriesData.filter(category =>
        category['name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        category['description'].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.pagination.total = this.allData.length;
    this.pagination.page = 1;
    this.updateDisplayedData();
  }

  onSort(sortEvent: SortEvent) {
    console.log('🔄 Ordenando categorías por:', sortEvent);
    // Aquí ordenarías los datos
  }

  onRowClick(row: TableData) {
    console.log('📝 Categoría seleccionada:', row);
    alert(`Categoría: ${row['name']}\nDescripción: ${row['description']}`);
  }

  onAction(event: ActionEvent) {
    console.log('🔧 Acción en categoría:', event.action, event.row);
    
    switch (event.action) {
      case 'edit':
        this.editCategory(event.row);
        break;
      case 'delete':
        this.toggleCategory(event.row);
        break;
    }
  }

  onAdd() {
    console.log('➕ Añadir nueva categoría');
    alert('Abrir formulario para nueva categoría');
  }

  private editCategory(category: any) {
    console.log('✏️ Editando categoría:', category);
    alert(`Editando categoría: ${category.name}`);
  }

  private toggleCategory(category: any) {
    const newStatus = category.status === 'Activo' ? 'Inactivo' : 'Activo';
    const action = newStatus === 'Activo' ? 'activar' : 'desactivar';
    
    if (confirm(`¿Estás seguro de ${action} la categoría "${category.name}"?`)) {
      console.log(`✅ Categoría ${action}da:`, category.name);
      // Aquí iría la lógica para cambiar el estado en tu API
      // category.status = newStatus;
      alert(`Categoría ${action}da correctamente`);
    }
  }
}