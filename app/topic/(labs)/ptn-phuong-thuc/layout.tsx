import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phương thức xét tuyển vào Đại học",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
