"use client";

import { Clipboard, Check } from "lucide-react";

import { ReactNode } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ToggleButton from "@/components/toggle-button/toggle-button";

export type Att = {
  name: ReactNode;
  type: ReactNode;
  note: ReactNode;
};

export const columns: ColumnDef<Att>[] = [
  {
    accessorKey: "name",
    header: "Thuộc tính",
    cell: ({ row }) => row.getValue("name") as ReactNode,
  },
  {
    accessorKey: "type",
    header: "Kiểu dữ liệu",
    cell: ({ row }) => row.getValue("type") as ReactNode,
  },
  {
    accessorKey: "note",
    header: "Mô tả",
    cell: ({ row }) => row.getValue("note") as ReactNode,
  },
];

export const rows: Att[] = [
  {
    name: "major_id",
    type: "text",
    note: "Mã ngành (do trường Đại học quy định)",
  },
  { name: "major_name", type: "text", note: "Tên ngành" },
  { name: "score", type: "number", note: "Điểm chuẩn gốc" },
  {
    name: "converted_score",
    type: "number",
    note: "Điểm chuẩn đã quy đổi về thang 30",
  },
  { name: "year", type: "number", note: "Năm" },
  { name: "note", type: "text", note: "Ghi chú" },
  {
    name: "industry_l1_id",
    type: "text",
    note: "Mã nhóm ngành (do BGD quy định)",
  },
  {
    name: "industry_l2_id",
    type: "text",
    note: "Mã ngành trung gian (do BGD quy định)",
  },
  {
    name: "industry_l3_id",
    type: "text",
    note: "Mã chuyên ngành (do BGD quy định)",
  },
  {
    name: "industry_l1_name",
    type: "text",
    note: "Tên ngành (do BGD quy định)",
  },
  { name: "method_id", type: "text", note: "Mã phương thức" },
  { name: "method_name", type: "text", note: "Tên phương thức" },
  {
    name: "subject_group_id",
    type: "text",
    note: (
      <>
        Mã tổ hợp môn. Chú ý tổ hợp <span className="code-inline">A000</span>{" "}
        hoặc <span className="code-inline">A001</span> đối với các phương thức
        có tổ hợp môn như <span className="code-inline">thpt</span>,{" "}
        <span className="code-inline">thhb</span>,... có ý nghĩa là Tổ hợp môn
        năng khiếu / Tổ hợp môn có ngoại ngữ không phải là tiếng Anh. Đối với
        các trường hợp khác thì 2 tổ hợp trên vô nghĩa.
      </>
    ),
  },
  {
    name: "subject1_id",
    type: "text",
    note: "Môn thứ 1 trong tổ hợp",
  },
  {
    name: "subject2_id",
    type: "text | NULL",
    note: "Mã môn thứ 2 trong tổ hợp",
  },
  {
    name: "subject3_id",
    type: "text | NULL",
    note: "Mã môn thứ 3 trong tổ hợp",
  },
  {
    name: "subject1_name",
    type: "text",
    note: "Tên thứ 1 trong tổ hợp",
  },
  {
    name: "subject2_name",
    type: "text | NULL",
    note: "Tên môn thứ 2 trong tổ hợp",
  },
  {
    name: "subject3_name",
    type: "text | NULL",
    note: "Tên môn thứ 3 trong tổ hợp",
  },
  {
    name: "school_id",
    type: "text",
    note: (
      <>
        <div>Mã tuyển sinh của trường, có một số giá trị đặc biệt sau:</div>
        <ul className="list-disc">
          <li className="ml-5">
            Mã các trường thuộc ĐHQG-HN bắt đầu bằng{" "}
            <span className="code-inline">QH</span>.
          </li>
          <li className="ml-5">
            Mã các trường thuộc ĐHQG-HCM bắt đầu bằng{" "}
            <span className="code-inline">QS</span>.
          </li>
          <li className="ml-5">
            Mã một số trường địa phương bắt đầu bằng{" "}
            <span className="code-inline">D</span>.
          </li>
          <li className="ml-5">
            Mã một số trường danh giá, lâu đời kết thúc bằng{" "}
            <span className="code-inline">A</span> (không có phân hiệu),{" "}
            <span className="code-inline">H</span> (phân hiệu Hà Nội),{" "}
            <span className="code-inline">S</span> (phân hiệu phía Nam).
          </li>
        </ul>
      </>
    ),
  },
  { name: "school_name", type: "text", note: "Tên trường" },
  {
    name: "school_short_name",
    type: "text | NULL",
    note: "Tên viết tắt của trường",
  },
  {
    name: "school_public",
    type: "0 | 1",
    note: (
      <>
        = <span className="code-inline">1</span> nếu là trường công lập.
      </>
    ),
  },
  {
    name: "school_region",
    type: "text",
    note: (
      <>
        <div> Vị trí địa lý của trường, gồm các giá trị là:</div>
        <ul className="list-disc">
          <li className="ml-5">
            <span className="code-inline">HNC</span> (Hà Nội).
          </li>
          <li className="ml-5">
            <span className="code-inline">HCMC</span> (TP.HCM).
          </li>
          <li className="ml-5">
            <span className="code-inline">NR</span> (miền Bắc, không bao gồm Hà
            Nội).
          </li>
          <li className="ml-5">
            <span className="code-inline">SR</span> (miền Nam, không bao gồm
            TP.HCM).
          </li>
          <li className="ml-5">
            <span className="code-inline">CR</span> (miền Trung).
          </li>
          <li className="ml-5">
            <span className="code-inline">CA</span> (các trường Công an).
          </li>
          <li className="ml-5">
            {" "}
            <span className="code-inline">QD</span> (các trường Quân đội).
          </li>
        </ul>
      </>
    ),
  },
];

export default function ScoreDataDef() {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function copySchemaHandler() {
    navigator.clipboard.writeText(
      `Cho bảng score.parquet có schema như sau: { "columns": [ { "name": "major_id", "type": "text", "note": "Mã ngành (do trường Đại học quy định)" }, { "name": "major_name", "type": "text", "note": "Tên ngành" }, { "name": "score", "type": "number", "note": "Điểm chuẩn gốc (do trường Đại học công bố)" }, { "name": "converted_score", "type": "number", "note": "Điểm chuẩn đã quy đổi về thang 30" }, { "name": "year", "type": "number", "note": "Năm" }, { "name": "note", "type": "text", "note": "Ghi chú" }, { "name": "industry_l1_id", "type": "text", "note": "Mã nhóm ngành (BGD)" }, { "name": "industry_l3_id", "type": "text", "note": "Mã chuyên ngành (BGD)" }, { "name": "industry_l1_name", "type": "text", "note": "Tên ngành (BGD)" }, { "name": "method_id", "type": "text", "note": "Mã phương thức tuyển sinh / xét tuyển" }, { "name": "method_name", "type": "text", "note": "Tên phương thức tuyển sinh / xét tuyển" }, { "name": "subject_group_id", "type": "text", "note": "Mã tổ hợp môn" }, { "name": "subject1_id", "type": "text", "note": "Mã môn thứ 1 trong tổ hợp" }, { "name": "subject2_id", "type": "text | NULL", "note": "Mã môn thứ 2 trong tổ hợp" }, { "name": "subject3_id", "type": "text | NULL", "note": "Mã môn thứ 3 trong tổ hợp" }, { "name": "subject1_name", "type": "text", "note": "Tên môn thứ 1 trong tổ hợp" }, { "name": "subject2_name", "type": "text | NULL", "note": "Tên môn thứ 2 trong tổ hợp" }, { "name": "subject3_name", "type": "text | NULL", "note": "Tên môn thứ 3 trong tổ hợp" }, { "name": "school_id", "type": "text", "note": "Mã tuyển sinh của trường", }, { "name": "school_name", "type": "text", "note": "Tên trường" }, { "name": "school_short_name", "type": "text | NULL", "note": "Tên viết tắt của trường" }, { "name": "school_public", "type": "0 | 1", "note": "1 = trường công lập, 0 = trường tư thục / dân lập / trường Quốc tế" }, { "name": "school_region", "type": "text", "note": "Vị trí địa lý", "values": [ "HNC (Hà Nội)", "HCMC (TP.HCM)", "NR (miền Bắc, không gồm HN)", "SR (miền Nam, không gồm HCM)", "CR (miền Trung)", "CA (Công an)", "QD (Quân đội)" ] } ] }`
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
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
                <TableCell
                  key={cell.id}
                  className={cell.column.id === "name" ? "code-inline" : ""}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="w-full my-5 flex items-center justify-center">
        <ToggleButton
          variant="outline"
          size="default"
          notExeIcon={
            <>
              <Clipboard className="button-icon" />
              Sao chép schema
            </>
          }
          exeIcon={
            <>
              <Check className="button-icon text-green-500" />
              Sao chép schema
            </>
          }
          onClick={copySchemaHandler}
        />
      </div>
    </div>
  );
}
