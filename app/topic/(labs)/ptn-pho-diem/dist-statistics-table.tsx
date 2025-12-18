"use client";

import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
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

import {
  round2,
  getScore,
} from "@/lib/universities/convertors/score-convertor";

import {
  type Dist,
  calcMean,
  calcMedian,
  calcStdDev,
} from "@/lib/universities/convertors/exam-distributions";

type DistStatisticsTableProps = {
  labels: string[];
  dists: Dist[];
  colors: string[];
};

export default function DistStatisticsTable({
  labels,
  dists,
  colors,
}: DistStatisticsTableProps) {
  if (!labels.length || !dists.length) return <></>;

  // DATA
  const data = useMemo(() => {
    return dists.map((d, i) => ({
      label: labels[i],
      color: colors[i],
      stdDev: round2(calcStdDev(d)),
      mean: round2(calcMean(d)),
      median: round2(calcMedian(d)),
      min: Math.min(
        ...d.freq.map((v, i) => getScore(i, d.min, d.max, d.freq.length))
      ),
      max: Math.max(
        ...d.freq.map((v, i) => getScore(i, d.min, d.max, d.freq.length))
      ),
      count: d.freq.reduce((s, v) => s + v, 0),
    }));
  }, [labels, dists, colors]);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const buildSortableHeader = (title: string, col: any) => (
      <div className="flex items-center justify-center gap-1">
        {title}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => col.toggleSorting(col.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="size-4 text-muted-foreground" />
        </Button>
      </div>
    );

    return [
      {
        accessorKey: "label",
        header: ({ column }) => buildSortableHeader("Score dist.", column),
        cell: ({ row }) => {
          const c = row.original.color;
          return (
            <div className="font-medium" style={{ color: c }}>
              {row.getValue("label")}
            </div>
          );
        },
      },
      {
        accessorKey: "stdDev",
        header: ({ column }) => buildSortableHeader("Std.Dev. s.", column),
        cell: ({ row }) => {
          const c = row.original.color;
          return (
            <div className="font-medium" style={{ color: c }}>
              {row.getValue("stdDev")}
            </div>
          );
        },
      },
      {
        accessorKey: "mean",
        header: ({ column }) => buildSortableHeader("Mean s.", column),
        cell: ({ row }) => {
          const c = row.original.color;
          return (
            <div className="font-medium" style={{ color: c }}>
              {row.getValue("mean")}
            </div>
          );
        },
      },
      {
        accessorKey: "median",
        header: ({ column }) => buildSortableHeader("Median s.", column),
        cell: ({ row }) => {
          const c = row.original.color;
          return (
            <div className="font-medium" style={{ color: c }}>
              {row.getValue("median")}
            </div>
          );
        },
      },
      {
        accessorKey: "min",
        header: ({ column }) => buildSortableHeader("Min s.", column),
        cell: ({ row }) => {
          const c = row.original.color;
          return (
            <div className="font-medium" style={{ color: c }}>
              {row.getValue("min")}
            </div>
          );
        },
      },
      {
        accessorKey: "max",
        header: ({ column }) => buildSortableHeader("Max s.", column),
        cell: ({ row }) => {
          const c = row.original.color;
          return (
            <div className="font-medium" style={{ color: c }}>
              {row.getValue("max")}
            </div>
          );
        },
      },
      {
        accessorKey: "count",
        header: ({ column }) => buildSortableHeader("Sample size", column),
        cell: ({ row }) => {
          const c = row.original.color;
          return (
            <div className="font-medium" style={{ color: c }}>
              {row.getValue("count")}
            </div>
          );
        },
      },
    ];
  }, []);

  // STATES
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  // RENDER
  return (
    <div className="w-full">
      {/* COLUMN PICKER */}
      <div className="flex items-center justify-end py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Chọn cột hiển thị <ChevronDown className="ml-1 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table.getAllLeafColumns().map((column) => (
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

      {/* TABLE */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center gap-2 py-4">
          <Button
            variant="ghost"
            size="icon"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft className="size-5" />
          </Button>

          <span>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>

          <Button
            variant="ghost"
            size="icon"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
