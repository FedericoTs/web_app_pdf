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

// Types
type ProcessingRecord = {
  id: string
  filename: string
  status: 'completed' | 'failed' | 'processing'
  type: string
  processedAt: string
  provider: string
  cost: number
}

// Sample data generator
const generateSampleData = (): ProcessingRecord[] => {
  const types = ['Invoice', 'Receipt', 'Contract', 'Report']
  const providers = ['AWS', 'Azure', 'GCP']
  const statuses: ProcessingRecord['status'][] = ['completed', 'failed', 'processing']

  return Array.from({ length: 50 }, (_, i) => ({
    id: `doc-${i + 1}`,
    filename: `document-${i + 1}.pdf`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    processedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    provider: providers[Math.floor(Math.random() * providers.length)],
    cost: Number((Math.random() * 10).toFixed(4)),
  }))
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
              : 'bg-yellow-500'
          }`}
        />
        <span className="capitalize">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('type', {
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
  columnHelper.accessor('processedAt', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Processed At
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: info => new Date(info.getValue()).toLocaleString(),
  }),
  columnHelper.accessor('provider', {
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
  columnHelper.accessor('cost', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Cost
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: info => `$${info.getValue().toFixed(4)}`,
  }),
]

export default function HistoryPage() {
  const [data, setData] = useState<ProcessingRecord[]>([])
  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    // In a real app, this would be an API call
    setData(generateSampleData())
  }, [])

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
        <h2 className="text-3xl font-bold tracking-tight">Processing History</h2>
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
    </div>
  )
}
