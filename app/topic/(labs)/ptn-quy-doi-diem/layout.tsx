import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quy đổi điểm thi Đại học",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
