import ErrorPage from "@/components/error-page";

export default function Page() {
  return (
    <ErrorPage
      code="404"
      msg="Đường dẫn không hợp lệ, ý bạn là 'favorite-posts' hay 'my-posts'?"
    />
  );
}
