import ErrorPage from "@/components/error-page";

export default function Page() {
  return (
    <ErrorPage
      code="404"
      msg="Đường dẫn không hợp lệ, xem lại danh sách chủ đề."
    />
  );
}
