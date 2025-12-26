import { ChartArea } from "lucide-react";

import Quote from "@/components/quote";

import DistForm from "./dist-form";

export default function Page() {
  return (
    <div className="background-box">
      <div className="box w-full h-fit pb-10">
        <h1 className="box-title w-full flex items-center gap-2">
          <ChartArea className="size-7" /> Phòng thí nghiệm Phổ điểm
        </h1>

        <div className="space-y-3">
          <div>
            Lab này phục vụ cho việc so sánh, phân tích phổ điểm các kỳ thi và
            tổ hợp môn.
          </div>

          <Quote type="tip">
            <ul className="list-disc space-y-1">
              <li className="ml-5">
                Nhấn vào chú thích (label) của phổ điểm để{" "}
                <strong>tạm ẩn phổ điểm</strong> đó.
              </li>
              <li className="ml-5">
                Nếu có lỗi hiển thị phổ điểm, chỉ cần{" "}
                <strong>tải lại trang</strong> là được.
              </li>
            </ul>
          </Quote>

          <Quote type="warning">
            Dữ liệu về phổ điểm của tổ hợp môn được tổng hợp Toán học từ phổ
            điểm các môn con nên chỉ có tính tham khảo.
          </Quote>

          <DistForm />
        </div>
      </div>
    </div>
  );
}
