import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../shared/components/data-table/data-table';
import { StatsCards, StatCard } from '../../shared/components/stats-cards/stats-cards';
import { FeaturedCard } from '../../shared/components/featured-card/featured-card';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';
import { ModalForm, FormField } from '../../shared/components/modal-form/modal-form';
import { LucideAngularModule } from 'lucide-angular';
import { 
  Users, UserPlus, UserCheck, UserX, Shield, 
  Mail, Calendar, Key, TrendingUp, Award,
  Edit2, ToggleLeft, ToggleRight, Download
} from 'lucide-angular';

@Component({
  selector: 'app-users-page',
  imports: [
    DataTable, 
    ModalForm, 
    CommonModule, 
    LucideAngularModule,
    StatsCards,
    FeaturedCard
  ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss'
})
export class UsersPage implements OnInit {
  // Iconos para usar en el template
  icons = {
    users: Users,
    userPlus: UserPlus,
    userCheck: UserCheck,
    userX: UserX,
    shield: Shield,
    mail: Mail,
    calendar: Calendar,
    key: Key,
    trendingUp: TrendingUp,
    award: Award,
    edit2: Edit2,
    toggleLeft: ToggleLeft,
    toggleRight: ToggleRight,
    download: Download
  };

  // Datos de usuarios basados en tu BD
  usersData: TableData[] = [
    { 
      id_usuario: 1, 
      nombre: 'Ana García', 
      email: 'ana@tienda.com', 
      id_rol: 1, 
      nombre_rol: 'Administrador', 
      fecha_creacion: '2024-01-15 10:30:00', 
      estado: 'Activo',
      icon: 'userCheck'
    },
    { 
      id_usuario: 2, 
      nombre: 'Carlos López', 
      email: 'carlos@tienda.com', 
      id_rol: 2, 
      nombre_rol: 'Vendedor', 
      fecha_creacion: '2024-01-16 14:20:00', 
      estado: 'Activo',
      icon: 'userCheck'
    },
    { 
      id_usuario: 3, 
      nombre: 'María Torres', 
      email: 'maria@tienda.com', 
      id_rol: 2, 
      nombre_rol: 'Vendedor', 
      fecha_creacion: '2024-01-17 09:15:00', 
      estado: 'Activo',
      icon: 'userCheck'
    },
    { 
      id_usuario: 4, 
      nombre: 'Juan Pérez', 
      email: 'juan@tienda.com', 
      id_rol: 3, 
      nombre_rol: 'Inventario', 
      fecha_creacion: '2024-01-18 11:45:00', 
      estado: 'Inactivo',
      icon: 'userX'
    },
    { 
      id_usuario: 5, 
      nombre: 'Laura Medina', 
      email: 'laura@tienda.com', 
      id_rol: 2, 
      nombre_rol: 'Vendedor', 
      fecha_creacion: '2024-01-19 16:30:00', 
      estado: 'Activo',
      icon: 'userCheck'
    },
    { 
      id_usuario: 6, 
      nombre: 'Roberto Silva', 
      email: 'roberto@tienda.com', 
      id_rol: 1, 
      nombre_rol: 'Administrador', 
      fecha_creacion: '2024-01-20 08:00:00', 
      estado: 'Activo',
      icon: 'userCheck'
    }
  ];

  // ✅ ESTADÍSTICAS CONFIGURABLES PARA USUARIOS
  stats: StatCard[] = [
    {
      value: this.totalUsuarios,
      label: 'Total Usuarios',
      icon: this.icons.users,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      value: this.usuariosActivos,
      label: 'Usuarios Activos',
      icon: this.icons.userCheck,
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      value: this.usuariosPorRol['Administrador'] || 0,
      label: 'Administradores',
      icon: this.icons.shield,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      value: this.usuariosPorRol['Vendedor'] || 0,
      label: 'Vendedores',
      icon: this.icons.trendingUp,
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)'
    }
  ];

  // Propiedades para exportar
  showExportButton: boolean = true;
  exportTitle: string = 'Reporte de Usuarios';
  exportFileName: string = 'usuarios';
  
  // Propiedades para el modal
  showModal: boolean = false;
  modalLoading: boolean = false;
  modalTitle: string = 'Nuevo Usuario';

  // Roles disponibles (de tu tabla 'rol')
  roles = [
    { value: 1, label: '👑 Administrador' },
    { value: 2, label: '📊 Vendedor' },
    { value: 3, label: '📦 Inventario' }
  ];

  modalFields: FormField[] = [
    {
      key: 'nombre',
      label: 'Nombre Completo',
      type: 'text',
      required: true,
      placeholder: 'Ej: Ana García López',
    },
    {
      key: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      required: true,
      placeholder: 'ejemplo@tienda.com',
    },
    {
      key: 'id_rol',
      label: 'Rol del Usuario',
      type: 'select',
      required: true,
      options: this.roles,
    },
    {
      key: 'password',
      label: 'Contraseña',
      type: 'password',
      required: true,
      placeholder: 'Mínimo 6 caracteres',
    },
    {
      key: 'confirm_password',
      label: 'Confirmar Contraseña',
      type: 'password',
      required: true,
      placeholder: 'Repite la contraseña',
    }
  ];

  // Columnas para usuarios
  columns: Column[] = [
    { key: 'id_usuario', label: 'ID', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'nombre_rol', label: 'Rol', sortable: true },
    { key: 'fecha_creacion', label: 'Fecha Registro', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  // Configuración
  displayedData: TableData[] = [];
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 5,
    total: this.usersData.length
  };
  
  loading: boolean = false;
  showActions: boolean = true;
  showAddButton: boolean = true;
  addButtonLabel: string = 'Nuevo Usuario';

  // Acciones para la tabla
  actions = [
    { name: 'edit', label: 'Editar', icon: 'edit2', color: 'blue' },
    { name: 'toggle', label: 'Activar/Desactivar', icon: 'toggleLeft', color: 'orange', confirm: true }
  ];

  // Propiedades computadas para estadísticas
  get totalUsuarios(): number {
    return this.usersData?.length || 0;
  }

  get usuariosActivos(): number {
    return this.usersData?.filter(u => u['estado'] === 'Activo').length || 0;
  }

  get usuariosInactivos(): number {
    return this.usersData?.filter(u => u['estado'] === 'Inactivo').length || 0;
  }

  get usuariosPorRol(): any {
    const rolesCount: any = {};
    this.usersData?.forEach(user => {
      const rol = user['nombre_rol'];
      rolesCount[rol] = (rolesCount[rol] || 0) + 1;
    });
    return rolesCount;
  }

  get ultimoRegistro(): string {
    if (!this.usersData?.length) return 'Sin registros';
    const ultimo = this.usersData.reduce((prev, current) => 
      new Date(prev['fecha_creacion']) > new Date(current['fecha_creacion']) ? prev : current
    );
    return this.formatDate(ultimo['fecha_creacion']);
  }

  ngOnInit() {
    this.allData = [...this.usersData];
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
      this.allData = [...this.usersData];
    } else {
      this.allData = this.usersData.filter(user =>
        user['nombre'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        user['email'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        user['nombre_rol'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        user['id_usuario'].toString().includes(searchTerm)
      );
    }
    this.pagination.total = this.allData.length;
    this.pagination.page = 1;
    this.updateDisplayedData();
  }

  onSort(sortEvent: SortEvent) {
    console.log('🔄 Ordenando usuarios por:', sortEvent);
  }

  onRowClick(row: TableData) {
    console.log('👤 Usuario seleccionado:', row);
    alert(`👤 Usuario: ${row['nombre']}\n📧 Email: ${row['email']}\n👑 Rol: ${row['nombre_rol']}\n📅 Registro: ${this.formatDate(row['fecha_creacion'])}\n📊 Estado: ${row['estado']}`);
  }

  onAction(event: ActionEvent) {
    console.log('🔧 Acción en usuario:', event.action, event.row);
    
    switch (event.action) {
      case 'edit':
        this.editUser(event.row);
        break;
      case 'toggle':
        this.toggleUser(event.row);
        break;
    }
  }

  onAdd() {
    this.showModal = true;
  }

  onExport() {
    console.log('📄 Exportando usuarios a PDF');
  }

  // Métodos para el modal
  onSaveUser(formData: any) {
    console.log('💾 Guardando usuario:', formData);

    // Validar contraseñas
    if (formData.password !== formData.confirm_password) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      alert('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.modalLoading = true;

    // Simular guardado
    setTimeout(() => {
      const rol = this.roles.find(r => r.value == formData.id_rol)?.label.replace(/[👑📊📦]/g, '').trim() || 'Desconocido';
      
      // Registrar el nuevo usuario
      const newUser = {
        id_usuario: this.usersData.length + 1,
        nombre: formData.nombre,
        email: formData.email,
        id_rol: formData.id_rol,
        nombre_rol: rol,
        fecha_creacion: new Date().toLocaleString('es-ES'),
        estado: 'Activo',
        icon: 'userCheck'
      };

      this.usersData.unshift(newUser);
      this.updateDisplayedData();
      
      this.modalLoading = false;
      this.showModal = false;
      
      alert('✅ Usuario creado exitosamente');
    }, 1000);
  }

  onCancelModal() {
    this.showModal = false;
  }

  private editUser(user: any) {
    console.log('✏️ Editando usuario:', user);
    alert(`Editando usuario: ${user.nombre}`);
  }

  private toggleUser(user: any) {
    const newStatus = user.estado === 'Activo' ? 'Inactivo' : 'Activo';
    const action = newStatus === 'Activo' ? 'activar' : 'desactivar';
    
    if (confirm(`¿Estás seguro de ${action} al usuario "${user.nombre}"?`)) {
      console.log(`✅ Usuario ${action}do:`, user.nombre);
      alert(`Usuario ${action}do correctamente`);
    }
  }

  // Obtener clase CSS para el estado
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Activo': 'status-active',
      'Inactivo': 'status-inactive'
    };
    return statusClasses[status] || '';
  }

  // Obtener icono para el estado
  getStatusIcon(status: string): any {
    const statusIcons: { [key: string]: any } = {
      'Activo': this.icons.userCheck,
      'Inactivo': this.icons.userX
    };
    return statusIcons[status] || this.icons.userX;
  }

  // Formatear fecha
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Obtener el icono Lucide
  getUserIcon(iconName: string): any {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.users;
  }
}