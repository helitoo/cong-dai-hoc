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
    <>
      <div className="background-box p-10 md:p-20 flex flex-col">
        <h1 className="font-bold font-montserrat text-9xl text-sky-500">
          {code}
        </h1>
        <p className="text-3xl tracking-tight font-bold mt-3 mb-1">
          {msg ?? codeMsgMapping?.[code] ?? "Lỗi!"}
        </p>
        <div className="w-full h-10 bg-sky-400/50 border-2 border-dashed border-sky-500"></div>
      </div>
    </>
  );
}
