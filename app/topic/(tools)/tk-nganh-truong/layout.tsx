import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trắc nghiệm tính cách Holland",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
