"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useBreadcrumb } from "@/components/general-layout/breadcrumb/breadcrumb-provider";

export default function CrumbInit() {
  const { setBreadcrumb } = useBreadcrumb();
  const pathname = usePathname();

  useEffect(() => {
    setBreadcrumb(pathname);
  }, []);

  useEffect(() => {
    setBreadcrumb(pathname);
  }, [pathname]);

  return <></>;
}
