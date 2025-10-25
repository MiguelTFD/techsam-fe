import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../shared/components/data-table/data-table';
import { StatsCards, StatCard } from '../../shared/components/stats-cards/stats-cards';
import { ExportButton } from '../../shared/components/export-button/export-button';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent} from '../../shared/components/data-table/types';
import { ModalForm, FormField } from '../../shared/components/modal-form/modal-form';
import { LucideAngularModule, Plus, CakeSlice, IceCreamCone, Candy, Cake, Coffee, Utensils, Gift, Package, TrendingUp, Award, Download} from 'lucide-angular';

@Component({
  selector: 'app-categories-page',
  imports: [
    DataTable, 
    ModalForm, 
    CommonModule, 
    LucideAngularModule,
    StatsCards,
    ExportButton
  ],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss'
})
export class CategoriesPage implements OnInit {
  // Iconos para usar en el template
  icons = {
    plus: Plus,
    cupcake: CakeSlice,
    iceCream: IceCreamCone,
    candy: Candy,
    cake: Cake,
    coffee: Coffee,
    utensils: Utensils,
    gift: Gift,
    package: Package,
    trendingUp: TrendingUp,
    award: Award,
    download: Download
  };

  // Propiedades para exportar
  showExportButton: boolean = true;
  exportTitle: string = 'Reporte de Categorías de Dulces';
  exportFileName: string = 'categorias_dulces';

  // ✅ INICIALIZAR categoriesData PRIMERO
  categoriesData: TableData[] = [
    { 
      id: 1, 
      name: 'Pasteles Decorados', 
      description: 'Pasteles artesanales con decoraciones especiales', 
      productCount: 15, 
      status: 'Activo',
      icon: 'cake'
    },
    { 
      id: 2, 
      name: 'Cupcakes', 
      description: 'Pequeños pasteles individuales con toppings', 
      productCount: 8, 
      status: 'Activo',
      icon: 'cupcake'
    },
    { 
      id: 3, 
      name: 'Helados Artesanales', 
      description: 'Helados gourmet con sabores únicos', 
      productCount: 12, 
      status: 'Activo',
      icon: 'iceCream'
    },
    { 
      id: 4, 
      name: 'Chocolates Finos', 
      description: 'Chocolates premium y trufas artesanales', 
      productCount: 20, 
      status: 'Activo',
      icon: 'candy'
    },
    { 
      id: 5, 
      name: 'Galletas Decoradas', 
      description: 'Galletas con glaseado y diseños creativos', 
      productCount: 5, 
      status: 'Activo',
      icon: 'utensils'
    },
    { 
      id: 6, 
      name: 'Postres Individuales', 
      description: 'Postres pequeños para eventos y regalos', 
      productCount: 7, 
      status: 'Activo',
      icon: 'gift'
    },
    { 
      id: 7, 
      name: 'Bebidas Dulces', 
      description: 'Malteadas, frappés y bebidas especiales', 
      productCount: 3, 
      status: 'Activo',
      icon: 'coffee'
    },
    { 
      id: 8, 
      name: 'Dulces Tradicionales', 
      description: 'Dulces mexicanos y tradicionales', 
      productCount: 9, 
      status: 'Activo',
      icon: 'candy'
    }
  ];

  // ✅ AHORA SÍ CREAR LAS STATS (después de categoriesData)
  stats: StatCard[] = [
    {
      value: this.totalCategories,
      label: 'Total Categorías',
      icon: this.icons.package,
      gradient: 'linear-gradient(135deg, #ff9cd9, #ff6bb8)'
    },
    {
      value: this.activeCategories,
      label: 'Categorías Activas',
      icon: this.icons.trendingUp,
      gradient: 'linear-gradient(135deg, #4ade80, #22c55e)'
    },
    {
      value: this.categoriesWithProducts,
      label: 'Con Productos',
      icon: this.icons.cake,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      value: this.totalProducts,
      label: 'Total Productos',
      icon: this.icons.gift,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
  ];

  // PROPIEDADES PARA EL MODAL de nueva categoria
  showModal: boolean = false;
  modalLoading: boolean = false;
  modalTitle: string = 'Nueva Categoría';

  modalFields: FormField[] = [
    {
      key: 'name',
      label: 'Nombre de la categoría',
      type: 'text',
      required: true,
      placeholder: 'Ej: Pasteles Decorados'
    },
    {
      key: 'description', 
      label: 'Descripción',
      type: 'textarea',
      required: false,
      placeholder: 'Descripción opcional de la categoría'
    }
  ];

  // Columnas específicas para categorías de dulces
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripción', sortable: true },
    { key: 'productCount', label: 'Productos', sortable: true },
    { key: 'status', label: 'Estado', sortable: true }
  ];

  exportColumns = [
    { key: 'id', label: 'ID'},
    { key: 'name', label: 'Nombre'},
    { key: 'description', label: 'Descripción'},
    { key: 'productCount', label: 'Productos'},
    { key: 'status', label: 'Estado'}
  ]

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
    return this.categoriesData?.length || 0; // ✅ Agregar safe navigation
  }

  get activeCategories(): number {
    return this.categoriesData?.filter(c => c['status'] === 'Activo').length || 0;
  }

  get categoriesWithProducts(): number {
    return this.categoriesData?.filter(c => c['productCount'] > 0).length || 0;
  }

  get totalProducts(): number {
    return this.categoriesData?.reduce((sum, category) => sum + category['productCount'], 0) || 0;
  }

  get topCategory(): string {
    if (!this.categoriesData?.length) return 'No hay categorías';
    const top = this.categoriesData.reduce((prev, current) => 
      (prev['productCount'] > current['productCount']) ? prev : current
    );
    return top['name'];
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
      case 'toggle':
        this.toggleCategory(event.row);
        break;
    }
  }

  onAdd() {
     this.showModal = true;
  }

  // Métodos para el modal
  onSaveCategory(formData: any) {
    console.log('💾 Guardando categoría:', formData);
    this.modalLoading = true;

    // Simular guardado
    setTimeout(() => {
      const newCategory = {
        id: this.categoriesData.length + 1,
        name: formData.name,
        description: formData.description,
        productCount: 0,
        status: 'Activo',
        icon: 'gift'
      };

      this.categoriesData.unshift(newCategory);
      this.updateDisplayedData();
      
      this.modalLoading = false;
      this.showModal = false;
      
      alert('✅ Categoría de dulce creada exitosamente 🍰');
    }, 1000);
  }

  onCancelModal() {
    this.showModal = false;
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
      alert(`Categoría ${action}da correctamente`);
    }
  }

  // Método para obtener el icono según la categoría
  getCategoryIcon(iconName: string): any {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.gift;
  }

  // Obtener clase CSS para el estado
  getStatusClass(status: string): string {
    return status === 'Activo' ? 'status-active' : 'status-inactive';
  }
}