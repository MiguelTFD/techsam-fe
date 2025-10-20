export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableData {
  [key: string]: any;
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
  placeholder?: string;
  debounceTime?: number;
}

export interface Action {
  name: string;
  label: string;
  icon?: string;
  color?: string;
}

export interface ActionEvent {
  action: string;
  row: TableData;
}