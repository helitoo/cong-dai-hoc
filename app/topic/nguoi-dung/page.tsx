import ErrorPage from "@/components/error-page";

export default function Page() {
  return (
    <ErrorPage
      code="404"
      msg="Đường dẫn không hợp lệ, nhập thêm ID người dùng."
    />
  );
}
