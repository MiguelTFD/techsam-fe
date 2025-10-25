import { Component, OnInit } from '@angular/core';
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

  // Datos de ejemplo para marcas de dulces 🍰
  brandsData: TableData[] = [
    { 
      id: 1, 
      name: 'Dulce Corazón', 
      description: 'Pastelería artesanal con ingredientes premium', 
      country: 'Francia', 
      productCount: 23, 
      status: 'Activo',
      icon: 'crown',
      since: 1995
    },
    { 
      id: 2, 
      name: 'Pastelería Mágica', 
      description: 'Creaciones únicas y decoraciones especiales', 
      country: 'Italia', 
      productCount: 18, 
      status: 'Activo',
      icon: 'award',
      since: 2005
    },
    { 
      id: 3, 
      name: 'Chocolatería Finita', 
      description: 'Chocolates gourmet y trufas artesanales', 
      country: 'Bélgica', 
      productCount: 15, 
      status: 'Activo',
      icon: 'star',
      since: 1988
    },
    { 
      id: 4, 
      name: 'Heladería Artesanal', 
      description: 'Helados naturales con sabores únicos', 
      country: 'Italia', 
      productCount: 12, 
      status: 'Activo',
      icon: 'globe',
      since: 1999
    },
    { 
      id: 5, 
      name: 'Galletas Encantadas', 
      description: 'Galletas decoradas con diseños creativos', 
      country: 'México', 
      productCount: 14, 
      status: 'Activo',
      icon: 'package',
      since: 2010
    },
    { 
      id: 6, 
      name: 'Repostería Creativa', 
      description: 'Postres innovadores y modernos', 
      country: 'España', 
      productCount: 9, 
      status: 'Activo',
      icon: 'building',
      since: 2015
    },
    { 
      id: 7, 
      name: 'Dulces Tradicionales', 
      description: 'Recetas ancestrales y auténticas', 
      country: 'México', 
      productCount: 7, 
      status: 'Activo',
      icon: 'users',
      since: 1975
    },
    { 
      id: 8, 
      name: 'Postres Gourmet', 
      description: 'Alta repostería y presentaciones elegantes', 
      country: 'Francia', 
      productCount: 5, 
      status: 'Inactivo',
      icon: 'award',
      since: 2008
    },
    { 
      id: 9, 
      name: 'Cafetería Especial', 
      description: 'Bebidas dulces y acompañamientos', 
      country: 'Colombia', 
      productCount: 11, 
      status: 'Activo',
      icon: 'globe',
      since: 2012
    },
    { 
      id: 10, 
      name: 'Confitería Real', 
      description: 'Dulces finos y caramelos artesanales', 
      country: 'Suiza', 
      productCount: 8, 
      status: 'Activo',
      icon: 'crown',
      since: 1992
    }
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

  // ✅ ESTADÍSTICAS CONFIGURABLES PARA EL NUEVO COMPONENTE
  stats: StatCard[] = [
    {
      value: this.totalBrands,
      label: 'Total Marcas',
      icon: this.icons.building,
      gradient: 'linear-gradient(135deg, #ff9cd9, #ff6bb8)'
    },
    {
      value: this.activeBrands,
      label: 'Marcas Activas',
      icon: this.icons.trendingUp,
      gradient: 'linear-gradient(135deg, #4ade80, #22c55e)'
    },
    {
      value: this.internationalBrands,
      label: 'Países',
      icon: this.icons.globe,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      value: this.totalProducts,
      label: 'Total Productos',
      icon: this.icons.package,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
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

  get totalProducts(): number {
    return this.brandsData.reduce((sum, brand) => sum + brand['productCount'], 0);
  }

  get topBrand(): string {
    const top = this.brandsData.reduce((prev, current) => 
      (prev['productCount'] > current['productCount']) ? prev : current
    );
    return top['name'];
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
      console.log(`✅ Marca ${action}da:`, brand.name);
      alert(`Marca ${action}da correctamente 🎀`);
    }
  }

  onAdd() {
    this.showModal = true;
  }

  onSaveBrand(formData: any) {
    console.log('💾 Guardando marca:', formData);
    this.modalLoading = true;

    setTimeout(() => {
      const newBrand = {
        id: this.brandsData.length + 1,
        name: formData.name,
        description: formData.description,
        country: formData.country,
        productCount: 0,
        status: 'Activo',
        icon: this.getRandomIcon(),
        since: new Date().getFullYear()
      };

      this.brandsData.unshift(newBrand);
      this.updateDisplayedData();
      
      this.modalLoading = false;
      this.showModal = false;
      
      alert('🎉 Marca creada exitosamente! 🌟');
    }, 1000);
  }

  onCancelModal() {
    this.showModal = false;
  }

  private editBrand(brand: any) {
    console.log('✏️ Editando marca:', brand);
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