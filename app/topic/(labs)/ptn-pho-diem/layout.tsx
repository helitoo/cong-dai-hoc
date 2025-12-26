import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phổ điểm thi Đại học",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
