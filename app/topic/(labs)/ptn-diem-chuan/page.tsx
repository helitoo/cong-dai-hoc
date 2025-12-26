import { Database } from "lucide-react";

import Link from "next/link";

import Quote from "@/components/quote";

import ScoreDataDef from "@/app/topic/(labs)/ptn-diem-chuan/score-data-def";
import ScoreQueryForm from "@/app/topic/(labs)/ptn-diem-chuan/score-query-form";

export default function Page() {
  return (
    <div className="background-box">
      <div className="box w-full h-fit pb-10">
        <h1 className="box-title w-full flex items-center gap-2">
          <Database className="size-7 hidden md:block" /> Phòng thí nghiệm Điểm
          chuẩn
        </h1>

        <div className="space-y-3">
          <div>
            Lab này cho phép bạn dùng SQL để truy vấn tự do dữ liệu của Cổng Đại
            học.
          </div>

          <div>
            Bạn chỉ có thể truy vấn 1 bảng duy nhất là{" "}
            <span className="font-semibold font-[Consolas,monospace]">
              score.parquet
            </span>{" "}
            có định nghĩa như sau:
          </div>

          <ScoreDataDef />

          <Quote type="note" title="Vấn đề mã ngành">
            Có 2 loại mã ngành là mã ngành do trường Đại học tự đặt (
            <span className="code-inline">major_id</span>) và mã ngành do BGD
            quy định (
            <span className="code-inline">
              industry_l1_id + industry_l2_id + industry_l3_id
            </span>
            . Bạn có thể xem chi tiết vấn đề này tại{" "}
            <Link
              href="https://thuvienphapluat.vn/van-ban/Giao-duc/Thong-tu-09-2022-TT-BGDDT-Danh-muc-thong-ke-nganh-dao-tao-giao-duc-dai-hoc-516993.aspx"
              className="link"
            >
              Thông tư 09/2022/TT-BGDĐT
            </Link>
            .)
          </Quote>

          <Quote type="tip">
            <ul className="list-disc">
              <li className="ml-5">
                Nên dùng <span className="code-inline">LIMIT 50</span> để tránh
                lag.
              </li>
              <li className="ml-5">
                Lab hỗ trợ sẵn filter và sort theo các cột sau khi truy vấn.
              </li>
              <li className="ml-5">
                Nếu bạn muốn dataset, có thể xem tại repository hoặc Kaggle.
              </li>
            </ul>
          </Quote>

          <div className="italic">
            Xem thêm{" "}
            <Link
              href={"https://duckdb.org/docs/stable/sql/query_syntax/select"}
              target="_blank"
              className="link"
            >
              DuckDB Query syntax
            </Link>
            .
          </div>

          <ScoreQueryForm />
        </div>
      </div>
    </div>
  );
}
