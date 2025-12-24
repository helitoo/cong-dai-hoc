const codeMsgMapping: Record<string, string> = {
  "400": "Yêu cầu không hợp lệ!",
  "401": "Chưa đăng nhập!",
  "402": "Cần thanh toán!",
  "403": "Không có quyền truy cập!",
  "404": "Không tìm thấy nội dung!",
  "405": "Phương thức không hợp lệ!",
  "408": "Yêu cầu lố thời gian!",
  "409": "Dữ liệu bị xung đột!",
  "410": "Nội dung không còn tồn tại!",
  "413": "Dữ liệu gửi lên quá lớn!",
  "415": "Định dạng dữ liệu không hợp lệ!",
  "422": "Dữ liệu không hợp lệ!",
  "429": "Bạn thao tác quá nhanh, vui lòng thử lại!",
  "500": "Lỗi hệ thống!",
  "501": "Chức năng chưa được hỗ trợ!",
  "502": "Lỗi máy chủ trung gian!",
  "503": "Dịch vụ đang tạm ngưng!",
  "504": "Máy chủ phản hồi quá lâu!",
};

export default function ErrorPage({
  code,
  msg = "",
}: {
  code: string;
  msg?: string;
}) {
  return (
    <div className="background-box p-10 md:p-20 flex flex-col">
      <div className="relative inline-block">
        {/* CODE – nổi lên trên */}
        <h1
          className="
        relative
        font-bold font-montserrat text-9xl
        bg-linear-to-r from-cyan-300 to-sky-500
        bg-clip-text text-transparent
        z-10
      "
        >
          {code}
        </h1>

        {/* LABEL BOX – phụ thuộc wrapper (div), không phụ thuộc h1 */}
        <span
          className="
        pointer-events-none absolute
        left-0 right-0
        top-2/3
        h-10 py-8 pt-15
        bg-sky-400/20
        border-b-2 border-r-2 border-dashed border-sky-500
        flex items-center
        text-3xl tracking-tight font-bold
        text-sky-500
        z-0
      "
        >
          {msg ?? codeMsgMapping?.[code] ?? "Lỗi!"}
        </span>
      </div>
    </div>
  );
}
