import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../shared/components/data-table/data-table';
import { StatsCards, StatCard } from '../../shared/components/stats-cards/stats-cards';
import { ExportButton } from '../../shared/components/export-button/export-button';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';
import { ModalForm, FormField } from '../../shared/components/modal-form/modal-form';
import { LucideAngularModule } from 'lucide-angular';
import { 
  Crown, Plus, Building2, Globe, Package, 
  TrendingUp, Users, Award, Star, Download
} from 'lucide-angular';
import { BrandService, Brand } from '../../core/services/brand.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-brands-page',
  imports: [
    CommonModule,
    DataTable, 
    ModalForm, 
    LucideAngularModule,
    StatsCards,
    ExportButton
  ],
  templateUrl: './brands-page.html',
  styleUrl: './brands-page.scss'
})
export class BrandsPage implements OnInit {
  private brandService = inject(BrandService);

  // Iconos para usar en el template
  icons = {
    crown: Crown,
    plus: Plus,
    building: Building2,
    globe: Globe,
    package: Package,
    trendingUp: TrendingUp,
    users: Users,
    award: Award,
    star: Star,
    download: Download
  };

  // Propiedades para exportar
  showExportButton: boolean = true;
  exportTitle: string = 'Reporte de Marcas Dulces';
  exportFileName: string = 'marcas_dulces';
  
  // PROPIEDADES PARA EL MODAL
  showModal: boolean = false;
  modalLoading: boolean = false;
  modalTitle: string = 'Nueva Marca';

  modalFields: FormField[] = [
    {
      key: 'name',
      label: 'Nombre de la marca',
      type: 'text',
      required: true,
      placeholder: 'Ej: Dulce Corazón, Pastelería Mágica...'
    },
    {
      key: 'description', 
      label: 'Descripción',
      type: 'textarea',
      required: false,
      placeholder: 'Descripción de la marca o especialidad'
    },
    {
      key: 'country',
      label: 'País de origen',
      type: 'text',
      required: true,
      placeholder: 'Ej: Italia, Francia, México...'
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

  exportColumns = [
    { key: 'id', label: 'ID'},
    { key: 'name', label: 'Nombre'},
    { key: 'description', label: 'Descripción'},
    { key: 'country', label: 'País'},
    { key: 'productCount', label: 'Productos'},
    { key: 'status', label: 'Estado'}
  ]

  // Datos reales desde el backend
  brandsData: TableData[] = [];
  displayedData: TableData[] = [];

  // Configuración
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 5,
    total: 0
  };
  
  loading: boolean = false;
  showActions: boolean = true;
  showAddButton: boolean = true;
  addButtonLabel: string = 'Nueva Marca';

  actions = [
    { name: 'edit', label: 'Editar', icon: 'edit2', color: 'blue' },
    { name: 'toggle', label: 'Activar/Desactivar', icon: 'toggleLeft', color: 'orange', confirm: true }
  ];

  // Estadísticas
  stats: StatCard[] = [
    {
      value: 0,
      label: 'Total Marcas',
      icon: this.icons.building,
      gradient: 'linear-gradient(135deg, #ff9cd9, #ff6bb8)'
    },
    {
      value: 0,
      label: 'Marcas Activas',
      icon: this.icons.trendingUp,
      gradient: 'linear-gradient(135deg, #4ade80, #22c55e)'
    },
    {
      value: 0,
      label: 'Países',
      icon: this.icons.globe,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      value: 0,
      label: 'Total Productos',
      icon: this.icons.package,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
  ];

  private allData: TableData[] = [];

  ngOnInit() {
    this.loadBrands();
    this.loadStats();
  }

  private loadBrands() {
    this.loading = true;
    this.brandService.getBrands(this.pagination.page, this.pagination.pageSize)
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading brands:', error);
          alert('Error al cargar las marcas');
          return of({ data: { brands: [], total: 0 }, success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.brandsData = response.data.brands;
          this.allData = [...this.brandsData];
          this.pagination.total = response.data.total;
          this.updateDisplayedData();
        }
      });
  }

  private loadStats() {
    this.brandService.getBrandStats()
      .pipe(
        catchError(error => {
          console.error('Error loading stats:', error);
          return of({ 
            data: {
              totalBrands: 0,
              activeBrands: 0,
              internationalBrands: 0,
              totalProducts: 0,
              topBrand: 'N/A'
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

  private updateStats(statsData: any) {
    this.stats[0].value = statsData.totalBrands;
    this.stats[1].value = statsData.activeBrands;
    this.stats[2].value = statsData.internationalBrands;
    this.stats[3].value = statsData.totalProducts;
  }

  private updateDisplayedData() {
    const startIndex = (this.pagination.page - 1) * this.pagination.pageSize;
    const endIndex = startIndex + this.pagination.pageSize;
    this.displayedData = this.allData.slice(startIndex, endIndex);
  }

  // Manejar eventos de la tabla
  onPageChange(page: number) {
    this.pagination.page = page;
    this.loadBrands();
  }

  onSearchChange(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.loadBrands();
    } else {
      this.loading = true;
      this.brandService.getBrands(1, this.pagination.pageSize, searchTerm)
        .pipe(
          finalize(() => this.loading = false),
          catchError(error => {
            console.error('Error searching brands:', error);
            alert('Error al buscar marcas');
            return of({ data: { brands: [], total: 0 }, success: false, message: '' });
          })
        )
        .subscribe(response => {
          if (response.success) {
            this.brandsData = response.data.brands;
            this.allData = [...this.brandsData];
            this.pagination.total = response.data.total;
            this.pagination.page = 1;
            this.updateDisplayedData();
          }
        });
    }
  }

  onSort(sortEvent: SortEvent) {
    console.log('🔄 Ordenando marcas por:', sortEvent);
    // Implementar lógica de ordenamiento si es necesario
  }

  onRowClick(row: TableData) {
    console.log('📝 Marca seleccionada:', row);
    alert(`🎀 Marca: ${row['name']}\n🌎 País: ${row['country']}\n📦 Productos: ${row['productCount']}\n⭐ Desde: ${row['since'] || 'N/A'}`);
  }

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
      this.brandService.toggleBrandStatus(brand.id)
        .pipe(
          catchError(error => {
            console.error('Error toggling brand status:', error);
            alert('Error al cambiar el estado de la marca');
            return of({ data: null, success: false, message: '' });
          })
        )
        .subscribe(response => {
          if (response.success) {
            console.log(`✅ Marca ${action}da:`, brand.name);
            alert(`Marca ${action}da correctamente 🎀`);
            this.loadBrands(); // Recargar datos
            this.loadStats(); // Actualizar estadísticas
          }
        });
    }
  }

  onAdd() {
    this.showModal = true;
  }

  onSaveBrand(formData: any) {
    console.log('💾 Guardando marca:', formData);
    this.modalLoading = true;

    this.brandService.createBrand(formData)
      .pipe(
        finalize(() => this.modalLoading = false),
        catchError(error => {
          console.error('Error creating brand:', error);
          alert('Error al crear la marca');
          return of({ data: null, success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.showModal = false;
          alert('🎉 Marca creada exitosamente! 🌟');
          this.loadBrands(); // Recargar datos
          this.loadStats(); // Actualizar estadísticas
        } else {
          alert('Error al crear la marca: ' + response.message);
        }
      });
  }

  onCancelModal() {
    this.showModal = false;
  }

  private editBrand(brand: any) {
    console.log('✏️ Editando marca:', brand);
    // Aquí puedes implementar un modal de edición similar al de creación
    alert(`Editando marca: ${brand.name}`);
  }

  // Método para obtener icono aleatorio para nuevas marcas
  private getRandomIcon(): string {
    const icons = ['crown', 'award', 'star', 'globe', 'building', 'users', 'package'];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  // Método para obtener el icono Lucide
  getBrandIcon(iconName: string): any {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.star;
  }

  // Obtener clase CSS para el estado
  getStatusClass(status: string): string {
    return status === 'Activo' ? 'status-active' : 'status-inactive';
  }

  // Obtener bandera emoji para el país
  getCountryFlag(country: string): string {
    const flagMap: { [key: string]: string } = {
      'Francia': '🇫🇷',
      'Italia': '🇮🇹', 
      'Bélgica': '🇧🇪',
      'México': '🇲🇽',
      'España': '🇪🇸',
      'Colombia': '🇨🇴',
      'Suiza': '🇨🇭'
    };
    return flagMap[country] || '🌎';
  }
}