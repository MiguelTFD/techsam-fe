// src/app/core/services/sale.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sale {
  id_venta: number;
  id_usuario: number;
  nombre_usuario: string;
  producto: string;
  fecha_venta: string;
  total: number;
  metodo_pago: string;
  estado: string;
  cantidad: number;
  precio_unitario?: number;
  icon?: string;
  observaciones?: string;
}

export interface SaleCreateRequest {
  id_usuario: number;
  id_producto: number;
  cantidad: number;
  metodo_pago: string;
  observaciones?: string;
}

export interface SaleStats {
  totalVentas: number;
  ventasCompletadas: number;
  totalIngresos: number;
  promedioVenta: number;
  mejorVendedor: string;
  ventasPendientes: number;
}

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion: string;
  categoria: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:3000/api'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  getSales(page: number = 1, pageSize: number = 10, search?: string): Observable<ApiResponse<{sales: Sale[], total: number}>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<{sales: Sale[], total: number}>>(`${this.apiUrl}/sales`, { params });
  }

  getSaleById(id: number): Observable<ApiResponse<Sale>> {
    return this.http.get<ApiResponse<Sale>>(`${this.apiUrl}/sales/${id}`);
  }

  createSale(saleData: SaleCreateRequest): Observable<ApiResponse<Sale>> {
    return this.http.post<ApiResponse<Sale>>(`${this.apiUrl}/sales`, saleData);
  }

  updateSaleStatus(id: number, estado: string): Observable<ApiResponse<Sale>> {
    return this.http.patch<ApiResponse<Sale>>(`${this.apiUrl}/sales/${id}/status`, { estado });
  }

  cancelSale(id: number): Observable<ApiResponse<Sale>> {
    return this.http.patch<ApiResponse<Sale>>(`${this.apiUrl}/sales/${id}/cancel`, {});
  }

  getSaleStats(): Observable<ApiResponse<SaleStats>> {
    return this.http.get<ApiResponse<SaleStats>>(`${this.apiUrl}/sales/stats`);
  }

  getAvailableProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products/available`);
  }

  getSellers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users/sellers`);
  }

  getPaymentMethods(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/sales/payment-methods`);
  }
}