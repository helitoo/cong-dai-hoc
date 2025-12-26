import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tính điểm tuyển sinh vào Đại học",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
