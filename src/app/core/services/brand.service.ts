import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Brand {
  id: number;
  name: string;
  description: string;
  country: string;
  productCount: number;
  status: string;
  icon?: string;
  since?: number;
}

export interface BrandCreateRequest {
  name: string;
  description: string;
  country: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'http://localhost:3000/api'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  getBrands(page: number = 1, pageSize: number = 10, search?: string): Observable<ApiResponse<{brands: Brand[], total: number}>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<{brands: Brand[], total: number}>>(`${this.apiUrl}/brands`, { params });
  }

  getBrandById(id: number): Observable<ApiResponse<Brand>> {
    return this.http.get<ApiResponse<Brand>>(`${this.apiUrl}/brands/${id}`);
  }

  createBrand(brandData: BrandCreateRequest): Observable<ApiResponse<Brand>> {
    return this.http.post<ApiResponse<Brand>>(`${this.apiUrl}/brands`, brandData);
  }

  updateBrand(id: number, brandData: Partial<BrandCreateRequest>): Observable<ApiResponse<Brand>> {
    return this.http.put<ApiResponse<Brand>>(`${this.apiUrl}/brands/${id}`, brandData);
  }

  toggleBrandStatus(id: number): Observable<ApiResponse<Brand>> {
    return this.http.patch<ApiResponse<Brand>>(`${this.apiUrl}/brands/${id}/toggle-status`, {});
  }

  deleteBrand(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/brands/${id}`);
  }

  getBrandStats(): Observable<ApiResponse<{
    totalBrands: number;
    activeBrands: number;
    internationalBrands: number;
    totalProducts: number;
    topBrand: string;
  }>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/brands/stats`);
  }
}