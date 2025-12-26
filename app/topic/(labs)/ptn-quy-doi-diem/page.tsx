import { ArrowRightLeft } from "lucide-react";

import Link from "next/link";

import Quote from "@/components/quote";

import ScoreConvertForm from "./score-convert-form";

export default function Page() {
  return (
    <div className="background-box">
      <div className="box w-full h-fit pb-10">
        <h1 className="box-title w-full flex items-center gap-2">
          <ArrowRightLeft className="size-7" /> Phòng thí nghiệm Quy đổi điểm
        </h1>

        <div className="space-y-3">
          <div>
            Lab này cho phép bạn quy đổi qua lại điểm từ phương thức này sang
            phương thức kia dựa trên quy đổi theo phân vị.
          </div>

          <Quote type="warning">
            <ul className="list-disc space-y-1">
              <li className="ml-5">
                Trang web quy đổi điểm dựa trên cách{" "}
                <strong>tìm phân vị tương đương</strong> của thí sinh trong phổ
                điểm phương thức này với phương thức kia. Phân vị là xếp hạng
                của thí sinh (trên thang 100) trong phổ điểm. Tóm lại, phân vị
                càng cao thì bạn càng mạnh.
              </li>
              <li className="ml-5">
                Tuy trang web có dữ liệu phổ điểm các kỳ thi sau nhưng không đầy
                đủ, buộc phải tự suy luận. Cho nên điểm quy đổi trong trang web
                này chỉ có tính tham khảo và có sai số khoảng{" "}
                <strong>(0 - 2)/30 điểm</strong>.
              </li>
            </ul>
          </Quote>

          <Quote type="tip">
            Để tìm tổ hợp tốt nhất cho bản thân, vào trang{" "}
            <Link href="/topic/tinh-diem" className="link">
              Tính điểm
            </Link>
            .
          </Quote>

          <ScoreConvertForm />
        </div>
      </div>
    </div>
  );
}
