import Link from "next/link";

import Quote from "@/components/quote";

import MajorFinderForm from "@/app/topic/(tools)/tk-nganh-truong/major-finder-form/major-queries-form";

export default function Page() {
  return (
    <div className="background-box flex flex-col">
      <div className="box w-full h-fit space-y-4">
        <h1 className="box-title w-full">Tìm kiếm Ngành - Trường</h1>

        <Quote type="warning">
          Trang này sử dụng kết quả{" "}
          <Link href="/topic/tinh-diem">Tính Điểm</Link> và{" "}
          <Link href="/topic/trac-nghiem-tinh-cach">Trắc nghiệm tính cách</Link>{" "}
          để tìm kiếm ngành / trường. Hãy chắc chắn rằng bạn đã điền đầy đủ
          thông tin cần thiết vào 2 trang đó trước khi sử dụng trang này.
        </Quote>

        <Quote type="tip">
          Nếu không chọn gì, trang web sẽ <strong>tìm kiếm tất cả</strong>.
        </Quote>

        <Quote type="warning">
          Trang web vẫn đang sử dụng tên cũ của trường Đại học Công nghệ kỹ
          thuật TP.HCM (HCMUTE) là{" "}
          <strong>trường Đại học Sư phạm kỹ thuật TP.HCM (HCMUTE)</strong>, mã
          tuyển sinh: <strong>SPK</strong>.
        </Quote>

        <MajorFinderForm />
      </div>
    </div>
  );
}
