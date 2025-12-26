import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điểm chuẩn vào Đại học",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
