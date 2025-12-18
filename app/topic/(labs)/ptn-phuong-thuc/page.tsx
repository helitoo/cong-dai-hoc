import { DoorOpen } from "lucide-react";

import Quote from "@/components/quote";

import MethodQueryForm from "@/app/topic/ptn-phuong-thuc/method-query-form";

export default function Page() {
  return (
    <div className="background-box">
      <div className="box w-full h-fit pb-10">
        <h1 className="box-title w-full flex items-center gap-2">
          <DoorOpen className="size-7" /> Phòng thí nghiệm Phương thức tuyển
          sinh
        </h1>

        <div className="space-y-3">
          <div>
            Lab này cung cấp cho bạn một cái nhìn tổng quan về tình hình tuyển
            sinh và đào tạo của các ngành và nhóm ngành hiện nay.
          </div>

          <Quote type="tip" title="Giải thích một số chỉ báo thống kê">
            <ul className="list-disc space-y-1">
              <li className="ml-5">
                <strong>Đơn vị tuyển sinh (ĐVTS)</strong> là số lượng mỗi tổ hợp
                [Mã ngành, Phương thức, Tổ hợp, Năm].
              </li>
              <li className="ml-5">
                <strong>Độ tập trung đào tạo</strong> của 1 nhóm ngành / ngành
                là tỷ lệ số ĐVTS nhóm ngành / ngành đó với tổng số ĐVTS của
                trường đó.
              </li>
              <li className="ml-5">
                <strong>Tiêu chí xếp hạng các trường Đại học</strong>: Xét kết
                hợp 3 tiêu chí: 50% trung vị điểm chuẩn (không tính HB), 30% độ
                tập trung đào tạo, 20% quy mô tuyển sinh.
              </li>
            </ul>
          </Quote>

          <MethodQueryForm />
        </div>
      </div>
    </div>
  );
}
