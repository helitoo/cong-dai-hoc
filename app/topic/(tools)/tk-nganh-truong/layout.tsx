import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm kiếm ngành / trường",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
