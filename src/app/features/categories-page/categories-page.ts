import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // ✅ Importar HttpClientModule
import { DataTable } from '../../shared/components/data-table/data-table';
import { StatsCards, StatCard } from '../../shared/components/stats-cards/stats-cards';
import { ExportButton } from '../../shared/components/export-button/export-button';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent} from '../../shared/components/data-table/types';
import { ModalForm, FormField } from '../../shared/components/modal-form/modal-form';
import { LucideAngularModule, Plus, CakeSlice, IceCreamCone, Candy, Cake, Coffee, Utensils, Gift, Package, TrendingUp, Award, Download} from 'lucide-angular';
import { CategoryService, Category } from '../../core/services/category.service'; 

@Component({
  selector: 'app-categories-page',
  imports: [
    DataTable, 
    ModalForm, 
    CommonModule, 
    LucideAngularModule,
    StatsCards,
    ExportButton,
    HttpClientModule 
  ],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
  providers: [CategoryService] 
})
export class CategoriesPage implements OnInit {
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


  categoriesData: TableData[] = [];

  stats: StatCard[] = [
    {
      value: 0,
      label: 'Total Categorías',
      icon: this.icons.package,
      gradient: 'linear-gradient(135deg, #ff9cd9, #ff6bb8)'
    },
    {
      value: 0,
      label: 'Categorías Activas',
      icon: this.icons.trendingUp,
      gradient: 'linear-gradient(135deg, #4ade80, #22c55e)'
    },
    {
      value: 0,
      label: 'Con Productos',
      icon: this.icons.cake,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      value: 0,
      label: 'Total Productos',
      icon: this.icons.gift,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
  ];

 
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

  displayedData: TableData[] = [];
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 5,
    total: 0 
  };
  
  loading: boolean = true;
  showActions: boolean = true;
  actions = [
    { name: 'edit', label: 'Editar', icon: '✏️', color: 'blue' },
    { name: 'toggle', label: 'Activar/Desactivar', icon: '🔁', color: 'orange', confirm: true }
  ];
  showAddButton: boolean = true;
  addButtonLabel: string = 'Nueva Categoría';

  constructor(private categoryService: CategoryService) {}

  // Propiedades computadas para estadísticas
  get totalCategories(): number {
    return this.categoriesData?.length || 0;
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
    this.loadCategories();
  }

  private allData: TableData[] = [];

  
  private loadCategories() {
    this.loading = true;
    
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {

        this.categoriesData = categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          productCount: cat.productCount,
          status: cat.status,
          icon: cat.icon || 'gift' // Valor por defecto
        }));

        this.allData = [...this.categoriesData];
        this.pagination.total = this.categoriesData.length;
        this.updateDisplayedData();
        this.updateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        alert('Error al cargar las categorías');
        this.loading = false;
      }
    });
  }

  // actualizar estadísticas
  private updateStats() {
    this.stats = [
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
  }

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
    console.log(' Ordenando categorías por:', sortEvent);
  }

  onRowClick(row: TableData) {
    console.log(' Categoría seleccionada:', row);
    alert(`Categoría: ${row['name']}\nDescripción: ${row['description']}`);
  }

  onAction(event: ActionEvent) {
    console.log('Acción en categoría:', event.action, event.row);
    
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

  // ✅ MODIFICAR onSaveCategory para guardar en el backend
  onSaveCategory(formData: any) {
    console.log(' Guardando categoría:', formData);
    this.modalLoading = true;

    const newCategory = {
      name: formData.name,
      description: formData.description,
      productCount: 0,
      status: 'Activo',
      icon: 'gift'
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: (savedCategory) => {
        // Agregar la nueva categoría al inicio de la lista
        this.categoriesData.unshift({
          id: savedCategory.id,
          ...newCategory
        });
        
        this.updateDisplayedData();
        this.updateStats(); // ✅ Actualizar estadísticas
        
        this.modalLoading = false;
        this.showModal = false;
        
        alert('✅ Categoría de dulce creada exitosamente 🍰');
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        alert('Error al crear la categoría');
        this.modalLoading = false;
      }
    });
  }

  onCancelModal() {
    this.showModal = false;
  }

  // ✅ MODIFICAR editCategory para usar el backend
  private editCategory(category: any) {
    console.log('✏️ Editando categoría:', category);
    // Aquí podrías abrir un modal de edición
    alert(`Editando categoría: ${category.name}`);
  }

  // ✅ MODIFICAR toggleCategory para usar el backend
  private toggleCategory(category: any) {
    const newStatus = category.status === 'Activo' ? 'Inactivo' : 'Activo';
    const action = newStatus === 'Activo' ? 'activar' : 'desactivar';
    
    if (confirm(`¿Estás seguro de ${action} la categoría "${category.name}"?`)) {
      this.categoryService.toggleCategoryStatus(category.id).subscribe({
        next: (updatedCategory) => {
          // Actualizar la categoría en el array local
          const index = this.categoriesData.findIndex(c => c.id === category.id);
          if (index !== -1) {
            this.categoriesData[index]['status'] = updatedCategory['status'];
            this.updateDisplayedData();
            this.updateStats();
          }
          alert(`Categoría ${action}da correctamente`);
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          alert('Error al cambiar el estado de la categoría');
        }
      });
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