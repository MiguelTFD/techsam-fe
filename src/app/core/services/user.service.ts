// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id_usuario: number;
  nombre: string;
  email: string;
  id_rol: number;
  nombre_rol: string;
  fecha_creacion: string;
  estado: string;
  icon?: string;
  telefono?: string;
  direccion?: string;
}

export interface UserCreateRequest {
  nombre: string;
  email: string;
  id_rol: number;
  password: string;
  confirm_password?: string;
  telefono?: string;
  direccion?: string;
}

export interface UserUpdateRequest {
  nombre?: string;
  email?: string;
  id_rol?: number;
  estado?: string;
  telefono?: string;
  direccion?: string;
}

export interface Role {
  id_rol: number;
  nombre_rol: string;
  descripcion?: string;
}

export interface UserStats {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  usuariosPorRol: { [key: string]: number };
  ultimoRegistro: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  getUsers(page: number = 1, pageSize: number = 10, search?: string): Observable<ApiResponse<{users: User[], total: number}>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<{users: User[], total: number}>>(`${this.apiUrl}/users`, { params });
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/users/${id}`);
  }

  createUser(userData: UserCreateRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/users`, userData);
  }

  updateUser(id: number, userData: UserUpdateRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/users/${id}`, userData);
  }

  toggleUserStatus(id: number): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/users/${id}/toggle-status`, {});
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/users/${id}`);
  }

  getUserStats(): Observable<ApiResponse<UserStats>> {
    return this.http.get<ApiResponse<UserStats>>(`${this.apiUrl}/users/stats`);
  }

  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(`${this.apiUrl}/roles`);
  }

  changePassword(id: number, currentPassword: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/users/${id}/change-password`, {
      currentPassword,
      newPassword
    });
  }
}