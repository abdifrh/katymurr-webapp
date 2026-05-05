import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'
import './DataTable.css'

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  getRowClassName?: (row: T) => string
}

function DataTable<T extends { id?: string }>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available.',
  onRowClick,
  getRowClassName,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  const getSortIndicator = (sortingState: false | 'asc' | 'desc') => {
    if (sortingState === 'asc') return '↑'
    if (sortingState === 'desc') return '↓'
    return '↕'
  }

  const getCellLabel = (header: unknown, columnId: string) => {
    if (typeof header === 'string') return header
    if (columnId) {
      return columnId
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    }
    return 'Field'
  }

  if (loading) {
    return (
      <div className="data-table-loading">
        <div className="wp-admin-loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="data-table-container">
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={header.column.getCanSort() ? 'sortable' : ''}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    <div className="th-content">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="sort-indicator">{getSortIndicator(header.column.getIsSorted())}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="no-items">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={`${onRowClick ? 'clickable-row' : ''} ${
                    getRowClassName ? getRowClassName(row.original) : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      data-label={getCellLabel(cell.column.columnDef.header, cell.column.id)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
