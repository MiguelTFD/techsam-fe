// src/app/core/services/inventory.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id_producto: number;
  nombre_producto: string;
  categoria: string;
  id_categoria: number;
  marca: string;
  id_marca: number;
  precio_venta: number;
  stock: number;
  estado_stock: string;
  descripcion?: string;
  icon?: string;
  precio_compra?: number;
  stock_minimo?: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface ProductCreateRequest {
  nombre_producto: string;
  id_categoria: number;
  id_marca: number;
  precio_venta: number;
  precio_compra?: number;
  stock: number;
  stock_minimo?: number;
  descripcion?: string;
}

export interface ProductUpdateRequest {
  nombre_producto?: string;
  id_categoria?: number;
  id_marca?: number;
  precio_venta?: number;
  precio_compra?: number;
  stock?: number;
  stock_minimo?: number;
  descripcion?: string;
  estado_stock?: string;
}

export interface Category {
  id_categoria: number;
  nombre_categoria: string;
  descripcion?: string;
}

export interface Brand {
  id_marca: number;
  nombre_marca: string;
  descripcion?: string;
}

export interface InventoryStats {
  totalProductos: number;
  productosDisponibles: number;
  productosAgotados: number;
  productosBajoStock: number;
  valorTotalInventario: number;
  productoMasVendido: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:3000/api'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  getProducts(page: number = 1, pageSize: number = 10, search?: string): Observable<ApiResponse<{products: Product[], total: number}>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<{products: Product[], total: number}>>(`${this.apiUrl}/products`, { params });
  }

  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(productData: ProductCreateRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, productData);
  }

  updateProduct(id: number, productData: ProductUpdateRequest): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, productData);
  }

  updateStock(id: number, stock: number): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(`${this.apiUrl}/products/${id}/stock`, { stock });
  }

  toggleProductStatus(id: number): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(`${this.apiUrl}/products/${id}/toggle-status`, {});
  }

  deleteProduct(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/products/${id}`);
  }

  getInventoryStats(): Observable<ApiResponse<InventoryStats>> {
    return this.http.get<ApiResponse<InventoryStats>>(`${this.apiUrl}/products/stats`);
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }

  getBrands(): Observable<ApiResponse<Brand[]>> {
    return this.http.get<ApiResponse<Brand[]>>(`${this.apiUrl}/brands`);
  }

  getLowStockProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products/low-stock`);
  }

  getOutOfStockProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products/out-of-stock`);
  }
}