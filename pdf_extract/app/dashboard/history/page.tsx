'use client'

import { useState, useEffect } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { ArrowUpDown, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/client'

// Types
type ProcessingRecord = {
  id: string
  filename: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  metadata: {
    type?: string
    provider?: string
    cost?: number
  }
  created_at: string
  updated_at: string
}

// Column definitions
const columnHelper = createColumnHelper<ProcessingRecord>()

const columns = [
  columnHelper.accessor('filename', {
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Filename
          <ArrowUpDown className="h-4 w-4" />
        </button>
      )
    },
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: info => (
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            info.getValue() === 'completed'
              ? 'bg-green-500'
              : info.getValue() === 'failed'
              ? 'bg-red-500'
              : info.getValue() === 'pending'
              ? 'bg-yellow-500'
              : 'bg-blue-500'
          }`}
        />
        <span className="capitalize">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('metadata.type', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Type
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
  }),
  columnHelper.accessor('metadata.provider', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Provider
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
  }),
  columnHelper.accessor('created_at', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created At
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: info => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.accessor('metadata.cost', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Cost
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: info => `$${info.getValue()?.toFixed(4)}`,
  }),
]

export default function HistoryPage() {
  const [data, setData] = useState<ProcessingRecord[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: records, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setData(records)
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Processing History')
    XLSX.writeFile(wb, 'processing-history.xlsx')
  }

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'processing-history.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Processing History</h2>
          <p className="text-muted-foreground">
            View and export your document processing history
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-muted-foreground">No documents processed yet</p>
            <button
              onClick={() => window.location.href = '/dashboard/upload'}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Upload your first document
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-4 py-3 text-left font-medium text-gray-500">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b last:border-none hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border bg-white px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="rounded-lg border bg-white px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </div>
    </div>
  )
}
