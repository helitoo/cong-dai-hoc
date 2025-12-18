"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useBreadcrumb } from "@/components/general-layout/breadcrumb/breadcrumb-provider";

export default function Profile({ id }: { id: string }) {
  const { setBreadcrumbAt } = useBreadcrumb();
  const pathname = usePathname();

  useEffect(() => {
    setBreadcrumbAt(1, { name: id, pathname });
  }, []);

  return <></>;
}
