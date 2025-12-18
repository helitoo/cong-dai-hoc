"use client";

import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Check,
} from "lucide-react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ToggleButton from "@/components/toggle-button/toggle-button";

export type ScoreQueryResultProps = Record<string, any>[] | null;

export function ScoreQueryResult({ data }: { data: ScoreQueryResultProps }) {
  if (!data) return <></>;

  // Export keys
  const keys = useMemo(
    () => (data.length > 0 ? Object.keys(data[0]) : []),
    [data]
  );

  // Auto-generate columns
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      ...keys.map((key) => ({
        accessorKey: key,
        header: ({ column }: any) => (
          // Sort button with columns labels
          <div className="flex gap-1 justify-center items-center">
            {key}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <ArrowUpDown className="size-4 text-muted-foreground" />
            </Button>
          </div>
        ),
        cell: ({ row }: any) => {
          const value = row.getValue(key);
          return <div>{String(value)}</div>;
        },
      })),
    ],
    [keys]
  );

  // Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters, columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full">
      {/* Filter */}
      <div className="flex items-center justify-between py-4">
        {/* Copy button */}
        <ToggleButton
          variant="outline"
          size="default"
          notExeIcon={
            <>
              <Clipboard className="button-icon" />
              Sao chép dữ liệu đã fetch
            </>
          }
          exeIcon={
            <>
              <Check className="button-icon text-green-500" />
              Sao chép dữ liệu đã fetch
            </>
          }
          onClick={async () =>
            await navigator.clipboard.writeText(
              JSON.stringify(data, (_, v) =>
                typeof v === "bigint" ? v.toString() : v
              )
            )
          }
        />

        {/* Column visibility picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Chọn cột hiển thị <ChevronDown className="button-icon ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table
              .getAllLeafColumns()
              .filter((c) => c.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(v) => column.toggleVisibility(!!v)}
                  className="capitalize"
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                ></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="ghost"
            size="icon"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft className="button-icon" />
          </Button>

          <span className="text-sm">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>

          <Button
            variant="ghost"
            size="icon"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight className="button-icon" />
          </Button>
        </div>
      </div>
    </div>
  );
}
