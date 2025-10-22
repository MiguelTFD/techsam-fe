import { Component } from '@angular/core';
import { DataTable } from '../../shared/components/data-table/data-table';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';
import { ModalForm, FormField } from '../../shared/components/modal-form/modal-form';

@Component({
  selector: 'app-brands-page',
  imports: [DataTable, ModalForm],
  templateUrl: './brands-page.html',
  styleUrl: './brands-page.scss'
})
export class BrandsPage {
  //Propiedades para exportar
  showExportButton: boolean = true;
  exportTitle: string = 'Reporte de Categorías';
  exportFileName: string = 'categorias';
  //PROPIEDADES PARA EL MODAL
  showModal: boolean = false;
  modalLoading: boolean = false;
  modalTitle: string = 'Nueva Marca';
  
  modalFields: FormField[] = [
    {
      key: 'name',
      label: 'Nombre de la marca',
      type: 'text',
      required: true,
      placeholder: 'Ej: Samsung, Apple, HP...'
    },
    {
      key: 'description', 
      label: 'Descripción',
      type: 'textarea',
      required: false,
      placeholder: 'Descripción de la marca o fabricante'
    },
    {
      key: 'country',
      label: 'País de origen',
      type: 'text',
      required: true,
      placeholder: 'Ej: Corea del Sur, Estados Unidos...'
    }
  ];
  // Columnas específicas para marcas
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripción', sortable: true },
    { key: 'country', label: 'País', sortable: true },
    { key: 'productCount', label: 'Productos', sortable: true },
    { key: 'status', label: 'Estado', sortable: true }
  ];

  // Datos de ejemplo para marcas
  brandsData: TableData[] = [
    { id: 1, name: 'Samsung', description: 'Tecnología y electrónica', country: 'Corea del Sur', productCount: 23, status: 'Activo' },
    { id: 2, name: 'Apple', description: 'Dispositivos y software', country: 'Estados Unidos', productCount: 18, status: 'Activo' },
    { id: 3, name: 'HP', description: 'Computadoras e impresoras', country: 'Estados Unidos', productCount: 15, status: 'Activo' },
    { id: 4, name: 'Lenovo', description: 'Equipos de computación', country: 'China', productCount: 12, status: 'Activo' },
    { id: 5, name: 'Dell', description: 'Tecnología y soluciones', country: 'Estados Unidos', productCount: 14, status: 'Activo' },
    { id: 6, name: 'Sony', description: 'Electrónica y entretenimiento', country: 'Japón', productCount: 9, status: 'Activo' },
    { id: 7, name: 'LG', description: 'Electrodomésticos y tecnología', country: 'Corea del Sur', productCount: 7, status: 'Activo' },
    { id: 8, name: 'Toshiba', description: 'Tecnología diversa', country: 'Japón', productCount: 5, status: 'Inactivo' },
    { id: 9, name: 'Asus', description: 'Hardware y componentes', country: 'Taiwán', productCount: 11, status: 'Activo' },
    { id: 10, name: 'Acer', description: 'Computadoras y monitores', country: 'Taiwán', productCount: 8, status: 'Activo' }
  ];

  // Configuración
  displayedData: TableData[] = [];
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 5,
    total: this.brandsData.length
  };
  
  loading: boolean = false;
  showActions: boolean = true;
  showAddButton: boolean = true;
  addButtonLabel: string = 'Nueva Marca';

   actions = [
    { name: 'edit', label: 'Editar', icon: '✏️', color: 'blue' },
    { name: 'toggle', label: 'Activar/Desactivar', icon: '🔁', color: 'orange', confirm: true }
  ];

  // Propiedades computadas para estadísticas
  get totalBrands(): number {
    return this.brandsData.length;
  }

  get activeBrands(): number {
    return this.brandsData.filter(b => b['status'] === 'Activo').length;
  }

  get internationalBrands(): number {
    const countries = new Set(this.brandsData.map(b => b['country']));
    return countries.size;
  }

  ngOnInit() {
    this.allData = [...this.brandsData];
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
      this.allData = [...this.brandsData];
    } else {
      this.allData = this.brandsData.filter(brand =>
        brand['name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand['description'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand['country'].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.pagination.total = this.allData.length;
    this.pagination.page = 1;
    this.updateDisplayedData();
  }

  onSort(sortEvent: SortEvent) {
    console.log('🔄 Ordenando marcas por:', sortEvent);
    // Aquí ordenarías los datos
  }

  onRowClick(row: TableData) {
    console.log('📝 Marca seleccionada:', row);
    alert(`Marca: ${row['name']}\nPaís: ${row['country']}\nProductos: ${row['productCount']}`);
  }

   // ACTUALIZAR el método onAction para usar toggle
  onAction(event: ActionEvent) {
    console.log('🔧 Acción en marca:', event.action, event.row);
    
    switch (event.action) {
      case 'edit':
        this.editBrand(event.row);
        break;
      case 'toggle':
        this.toggleBrand(event.row);
        break;
    }
  }

  private toggleBrand(brand: any) {
    const newStatus = brand.status === 'Activo' ? 'Inactivo' : 'Activo';
    const action = newStatus === 'Activo' ? 'activar' : 'desactivar';
    
    if (confirm(`¿Estás seguro de ${action} la marca "${brand.name}"?`)) {
      console.log(`✅ Marca ${action}da:`, brand.name);
      // Aquí iría la lógica para cambiar el estado en tu API
      // brand.status = newStatus;
      alert(`Marca ${action}da correctamente`);
    }
  }

  onAdd() {
    this.showModal = true;
  }
  // AGREGAR métodos para el modal
  onSaveBrand(formData: any) {
    console.log('💾 Guardando marca:', formData);
    this.modalLoading = true;

    // Simular guardado
    setTimeout(() => {
      // Aquí llamarías a tu API
      const newBrand = {
        id: this.brandsData.length + 1,
        name: formData.name,
        description: formData.description,
        country: formData.country,
        productCount: 0,
        status: 'Activo'
      };

      this.brandsData.unshift(newBrand);
      this.updateDisplayedData();
      
      this.modalLoading = false;
      this.showModal = false;
      
      alert('✅ Marca creada exitosamente');
    }, 1000);
  }

  onCancelModal() {
    this.showModal = false;
  }

  private editBrand(brand: any) {
    console.log('✏️ Editando marca:', brand);
    alert(`Editando marca: ${brand.name}`);
  }

  private deleteBrand(brand: any) {
    console.log('🗑️ Eliminando marca:', brand);
    if (confirm(`¿Estás seguro de eliminar la marca "${brand.name}"?\nTodos los productos asociados se verán afectados.`)) {
      // Lógica para eliminar
      console.log('Marca eliminada:', brand.id);
    }
  }
}