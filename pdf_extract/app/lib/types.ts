export interface Field {
  id: string;
  name: string;
  type: 'text' | 'number' | 'group';
  description: string;
  fields?: Field[];
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  field: string;
  value: string;
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}
