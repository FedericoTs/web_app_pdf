'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Field, FilterConfig, PaginationConfig, SortConfig } from '@/lib/types';
import { useTableData } from '@/app/hooks/useTableData';
import { TableFilter } from '@/components/TableFilter';
import { Pagination } from '@/components/ui/pagination';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

interface DataPreviewProps {
  data: any[];
  schema: Field[];
}

export default function DataPreview({ data, schema }: DataPreviewProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterConfig, setFilterConfig] = useState<FilterConfig | null>(() => {
    const firstFilterableField = schema.find(field => field.type !== 'group');
    return firstFilterableField ? { field: firstFilterableField.name, value: '' } : null;
  });
  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>({
    currentPage: 0,
    pageSize: 10,
    totalItems: data.length,
  });

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSort = (field: string) => {
    setSortConfig(current => {
      if (current?.field !== field) {
        return { field, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { field, direction: 'desc' };
      }
      return null;
    });
  };

  const handleFilter = (field: string, value: string) => {
    setFilterConfig({ field, value });
    setPaginationConfig(prev => ({ ...prev, currentPage: 0 }));
  };

  const handlePageChange = (page: number) => {
    setPaginationConfig(prev => ({ ...prev, currentPage: page }));
  };

  const { data: processedData, totalItems } = useTableData(
    data,
    sortConfig,
    filterConfig,
    paginationConfig
  );

  const formatValue = (value: any, field: Field): string => {
    if (value === null || value === undefined) return '-';
    
    switch (field.type) {
      case 'group':
        return Array.isArray(value) ? `[${value.length} items]` : '[]';
      case 'number':
        return typeof value === 'number' 
          ? value.toLocaleString() 
          : typeof value === 'string' 
            ? parseFloat(value).toLocaleString() 
            : '-';
      default:
        return String(value);
    }
  };

  const renderGroupContent = (groupData: any[], groupFields: Field[] = []) => {
    if (!Array.isArray(groupData) || !groupFields?.length) return null;

    return (
      <div className="mt-2 ml-4 bg-gray-50 p-4 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {groupFields.map(field => (
                <TableHead key={field.id} className="text-xs font-medium">
                  {field.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupData.map((item, idx) => (
              <TableRow key={`group-row-${idx}`}>
                {groupFields.map(field => (
                  <TableCell key={field.id} className="p-2 text-sm">
                    {formatValue(item[field.name], field)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data to display. Process some files to see the results here.
      </div>
    );
  }

  const totalPages = Math.ceil(totalItems / paginationConfig.pageSize);
  const filterableFields = schema.filter(field => field.type !== 'group');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Data Preview</h3>
        <TableFilter
          schema={filterableFields}
          onFilterChange={handleFilter}
          selectedField={filterConfig?.field || filterableFields[0]?.name}
        />
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">File</TableHead>
              {schema.map(field => (
                <TableHead 
                  key={field.id} 
                  className={cn(
                    "whitespace-nowrap",
                    field.type !== 'group' && "cursor-pointer hover:bg-gray-50"
                  )}
                  onClick={() => field.type !== 'group' && handleSort(field.name)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{field.name}</span>
                    {sortConfig?.field === field.name && (
                      sortConfig.direction === 'asc' 
                        ? <ArrowUpIcon className="h-4 w-4" />
                        : <ArrowDownIcon className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((item, index) => (
              <TableRow key={`main-row-${index}`}>
                <TableCell className="font-medium whitespace-nowrap">
                  {item.fileName}
                </TableCell>
                {schema.map(field => (
                  <TableCell key={field.id} className="max-w-md">
                    {field.type === 'group' ? (
                      <div>
                        <button
                          onClick={() => toggleRow(`${index}-${field.id}`)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {formatValue(item[field.name], field)}
                        </button>
                        {expandedRows.has(`${index}-${field.id}`) && (
                          renderGroupContent(item[field.name], field.fields)
                        )}
                      </div>
                    ) : (
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {formatValue(item[field.name], field)}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={paginationConfig.currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
