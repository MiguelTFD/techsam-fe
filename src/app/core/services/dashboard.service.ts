// src/app/core/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sale {
  id_venta: number;
  id_producto: number;
  nombre_producto: string;
  categoria: string;
  id_categoria: number;
  cantidad: number;
  precio_unitario: number;
  total: number;
  fecha_venta: string;
  metodo_pago: string;
  estado_venta: string;
}

export interface DashboardStats {
  totalProductos: number;
  totalVentasHoy: number;
  totalIngresosHoy: number;
  crecimientoVentas: number;
  productosBajoStock: number;
  productosAgotados: number;
  categoriaPopular: string;
  valorTotalInventario: number;
}

export interface PopularProduct {
  id_producto: number;
  nombre_producto: string;
  categoria: string;
  total_vendido: number;
  stock_actual: number;
  icon?: string;
}

export interface Reminder {
  tipo: 'stock_bajo' | 'stock_agotado' | 'venta_reciente' | 'categoria_popular';
  mensaje: string;
  cantidad?: number;
  fecha?: string;
  urgente: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Obtener estadísticas generales del dashboard
  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/dashboard/stats`);
  }

  // Obtener ventas con filtros opcionales
  getSales(startDate?: string, endDate?: string): Observable<ApiResponse<Sale[]>> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<ApiResponse<Sale[]>>(`${this.apiUrl}/sales`, { params });
  }

  // Obtener ventas de hoy
  getTodaySales(): Observable<ApiResponse<Sale[]>> {
    const today = new Date().toISOString().split('T')[0];
    return this.http.get<ApiResponse<Sale[]>>(`${this.apiUrl}/sales?fecha=${today}`);
  }

  // Obtener productos populares (más vendidos)
  getPopularProducts(limit: number = 5): Observable<ApiResponse<PopularProduct[]>> {
    return this.http.get<ApiResponse<PopularProduct[]>>(`${this.apiUrl}/products/popular?limit=${limit}`);
  }

  // Obtener recordatorios y alertas
  getReminders(): Observable<ApiResponse<Reminder[]>> {
    return this.http.get<ApiResponse<Reminder[]>>(`${this.apiUrl}/dashboard/reminders`);
  }

  // Obtener ventas de los últimos N días para gráficos
  getRecentSales(days: number = 7): Observable<ApiResponse<{fecha: string, total: number}[]>> {
    return this.http.get<ApiResponse<{fecha: string, total: number}[]>>(
      `${this.apiUrl}/sales/recent?days=${days}`
    );
  }
}