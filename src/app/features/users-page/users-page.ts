import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../shared/components/data-table/data-table';
import { StatsCards, StatCard } from '../../shared/components/stats-cards/stats-cards';
import { ExportButton } from '../../shared/components/export-button/export-button';
import { Column, TableData, PaginationConfig, SortEvent, ActionEvent } from '../../shared/components/data-table/types';
import { ModalForm, FormField } from '../../shared/components/modal-form/modal-form';
import { LucideAngularModule } from 'lucide-angular';
import { 
  Users, UserPlus, UserCheck, UserX, Shield, 
  Mail, Calendar, Key, TrendingUp, Award,
  Edit2, ToggleLeft, ToggleRight, Download
} from 'lucide-angular';
import { UserService, User, Role } from '../../core/services/user.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-users-page',
  imports: [
    DataTable, 
    ModalForm, 
    CommonModule, 
    LucideAngularModule,
    StatsCards,
    ExportButton
  ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss'
})
export class UsersPage implements OnInit {
  private userService = inject(UserService);

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

  // Datos reales desde el backend
  usersData: TableData[] = [];
  displayedData: TableData[] = [];

  // ✅ ESTADÍSTICAS CONFIGURABLES PARA USUARIOS
  stats: StatCard[] = [
    {
      value: 0,
      label: 'Total Usuarios',
      icon: this.icons.users,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    },
    {
      value: 0,
      label: 'Usuarios Activos',
      icon: this.icons.userCheck,
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      value: 0,
      label: 'Administradores',
      icon: this.icons.shield,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      value: 0,
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

  // Roles disponibles desde el backend
  roles: any[] = [];

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

  columns: Column[] = [
    { key: 'id_usuario', label: 'ID', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'nombre_rol', label: 'Rol', sortable: true },
    { key: 'fecha_creacion', label: 'Fecha Registro', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true }
  ];

  exportColumns = [
    { key: 'id_usuario', label: 'ID'},
    { key: 'nombre', label: 'Nombre'},
    { key: 'email', label: 'Email'},
    { key: 'nombre_rol', label: 'Rol'},
    { key: 'fecha_creacion', label: 'Fecha Registro'},
    { key: 'estado', label: 'Estado'}
  ]

  // Configuración
  pagination: PaginationConfig = {
    page: 1,
    pageSize: 5,
    total: 0
  };
  
  loading: boolean = false;
  showActions: boolean = true;
  showAddButton: boolean = true;
  addButtonLabel: string = 'Nuevo Usuario';

  actions = [
    { name: 'edit', label: 'Editar', icon: 'edit2', color: 'blue' },
    { name: 'toggle', label: 'Activar/Desactivar', icon: 'toggleLeft', color: 'orange', confirm: true }
  ];

  private allData: TableData[] = [];

  ngOnInit() {
    this.loadUsers();
    this.loadStats();
    this.loadRoles();
  }

  private loadUsers() {
    this.loading = true;
    this.userService.getUsers(this.pagination.page, this.pagination.pageSize)
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading users:', error);
          alert('Error al cargar los usuarios');
          return of({ data: { users: [], total: 0 }, success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.usersData = response.data.users;
          this.allData = [...this.usersData];
          this.pagination.total = response.data.total;
          this.updateDisplayedData();
        }
      });
  }

  private loadStats() {
    this.userService.getUserStats()
      .pipe(
        catchError(error => {
          console.error('Error loading user stats:', error);
          return of({ 
            data: {
              totalUsuarios: 0,
              usuariosActivos: 0,
              usuariosInactivos: 0,
              usuariosPorRol: {},
              ultimoRegistro: 'Sin registros'
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

  private loadRoles() {
    this.userService.getRoles()
      .pipe(
        catchError(error => {
          console.error('Error loading roles:', error);
          return of({ data: [], success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.roles = response.data.map((role: Role) => ({
            value: role.id_rol,
            label: this.getRoleDisplayName(role.nombre_rol)
          }));
          this.updateRoleField();
        }
      });
  }

  private updateStats(statsData: any) {
    this.stats[0].value = statsData.totalUsuarios;
    this.stats[1].value = statsData.usuariosActivos;
    this.stats[2].value = statsData.usuariosPorRol['Administrador'] || 0;
    this.stats[3].value = statsData.usuariosPorRol['Vendedor'] || 0;
  }

  private updateRoleField() {
    const roleField = this.modalFields.find(field => field.key === 'id_rol');
    if (roleField) {
      roleField.options = this.roles;
    }
  }

  private getRoleDisplayName(roleName: string): string {
    const roleIcons: { [key: string]: string } = {
      'Administrador': '👑 Administrador',
      'Vendedor': '📊 Vendedor',
      'Inventario': '📦 Inventario'
    };
    return roleIcons[roleName] || roleName;
  }

  private updateDisplayedData() {
    const startIndex = (this.pagination.page - 1) * this.pagination.pageSize;
    const endIndex = startIndex + this.pagination.pageSize;
    this.displayedData = this.allData.slice(startIndex, endIndex);
  }

  // Manejar eventos de la tabla
  onPageChange(page: number) {
    this.pagination.page = page;
    this.loadUsers();
  }

  onSearchChange(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.loadUsers();
    } else {
      this.loading = true;
      this.userService.getUsers(1, this.pagination.pageSize, searchTerm)
        .pipe(
          finalize(() => this.loading = false),
          catchError(error => {
            console.error('Error searching users:', error);
            alert('Error al buscar usuarios');
            return of({ data: { users: [], total: 0 }, success: false, message: '' });
          })
        )
        .subscribe(response => {
          if (response.success) {
            this.usersData = response.data.users;
            this.allData = [...this.usersData];
            this.pagination.total = response.data.total;
            this.pagination.page = 1;
            this.updateDisplayedData();
          }
        });
    }
  }

  onSort(sortEvent: SortEvent) {
    console.log('🔄 Ordenando usuarios por:', sortEvent);
    // Implementar lógica de ordenamiento si es necesario
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
    // Recargar roles para tener información actualizada
    this.loadRoles();
  }

  onSaveUser(formData: any) {
    console.log(' Guardando usuario:', formData);

    // Validar contraseñas
    if (formData.password !== formData.confirm_password) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.modalLoading = true;

    // Crear usuario en el backend
    const userData = {
      nombre: formData.nombre,
      email: formData.email,
      id_rol: formData.id_rol,
      password: formData.password
    };

    this.userService.createUser(userData)
      .pipe(
        finalize(() => this.modalLoading = false),
        catchError(error => {
          console.error('Error creating user:', error);
          alert('Error al crear el usuario');
          return of({ data: null, success: false, message: '' });
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.showModal = false;
          alert('Usuario creado exitosamente');
          
          // Recargar datos
          this.loadUsers();
          this.loadStats();
        } else {
          alert('Error al crear el usuario: ' + response.message);
        }
      });
  }

  onCancelModal() {
    this.showModal = false;
  }

  private editUser(user: any) {
    console.log(' Editando usuario:', user);
    // Aquí puedes implementar un modal de edición
    alert(`Editando usuario: ${user.nombre}`);
  }

  private toggleUser(user: any) {
    const newStatus = user.estado === 'Activo' ? 'Inactivo' : 'Activo';
    const action = newStatus === 'Activo' ? 'activar' : 'desactivar';
    
    if (confirm(`¿Estás seguro de ${action} al usuario "${user.nombre}"?`)) {
      this.userService.toggleUserStatus(user.id_usuario)
        .pipe(
          catchError(error => {
            console.error('Error toggling user status:', error);
            alert('Error al cambiar el estado del usuario');
            return of({ data: null, success: false, message: '' });
          })
        )
        .subscribe(response => {
          if (response.success) {
            console.log(`Usuario ${action}do:`, user.nombre);
            alert(`Usuario ${action}do correctamente`);
            
            // Recargar datos
            this.loadUsers();
            this.loadStats();
          }
        });
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
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  // Obtener el icono Lucide
  getUserIcon(iconName: string): any {
    return this.icons[iconName as keyof typeof this.icons] || this.icons.users;
  }

  // Obtener clase CSS para el rol
  getRoleClass(rol: string): string {
    const roleClasses: { [key: string]: string } = {
      'Administrador': 'role-admin',
      'Vendedor': 'role-seller',
      'Inventario': 'role-inventory'
    };
    return roleClasses[rol] || '';
  }
}