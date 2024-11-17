import { useMemo } from 'react';
import { SortConfig, FilterConfig, PaginationConfig } from '../lib/types';

export function useTableData<T extends Record<string, any>>(
  data: T[],
  sortConfig: SortConfig | null,
  filterConfig: FilterConfig | null,
  paginationConfig: PaginationConfig
) {
  return useMemo(() => {
    let processedData = [...data];

    // Apply filtering
    if (filterConfig && filterConfig.value) {
      processedData = processedData.filter(item => {
        const fieldValue = item[filterConfig.field];
        if (fieldValue === null || fieldValue === undefined) return false;
        
        const filterValue = filterConfig.value.toLowerCase();
        const stringValue = String(fieldValue).toLowerCase();
        
        // Handle array values (like in group fields)
        if (Array.isArray(fieldValue)) {
          return fieldValue.some(val => 
            String(val).toLowerCase().includes(filterValue)
          );
        }
        
        // Handle object values
        if (typeof fieldValue === 'object') {
          return Object.values(fieldValue).some(val =>
            String(val).toLowerCase().includes(filterValue)
          );
        }
        
        return stringValue.includes(filterValue);
      });
    }

    // Apply sorting
    if (sortConfig) {
      processedData.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        // Handle null/undefined values
        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Handle different value types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return sortConfig.direction === 'asc' 
            ? (aValue === bValue ? 0 : aValue ? -1 : 1)
            : (aValue === bValue ? 0 : aValue ? 1 : -1);
        }

        // Default string comparison
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        const comparison = aString.localeCompare(bString);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    // Calculate pagination
    const startIndex = paginationConfig.currentPage * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;
    const paginatedData = processedData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalItems: processedData.length,
    };
  }, [data, sortConfig, filterConfig, paginationConfig]);
}
