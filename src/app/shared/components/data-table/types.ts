// types.ts
export interface TableData {
  id?: number | string;
  [key: string]: any; // Para propiedades dinámicas
}

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  template?: any; // Para templates personalizados
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export interface SearchConfig {
  placeholder: string;
  debounceTime: number;
}

export interface Action {
  name: string;
  label: string;
  icon?: string;
  color?: string;
  confirm?: boolean;
}

export interface ActionEvent {
  action: string;
  row: TableData;
}