"use client";

import { Fragment } from "react";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useBreadcrumb } from "@/components/general-layout/breadcrumb/breadcrumb-provider";

export default function AppBreadcrumb() {
  const { crumbs } = useBreadcrumb();

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex flex-nowrap overflow-hidden max-w-full">
        {crumbs.filter(Boolean).map((crumb, index) => (
          <Fragment key={index}>
            <BreadcrumbItem className="shrink-0 max-w-[200px]">
              <BreadcrumbLink asChild className="block truncate">
                <Link href={crumb.pathname}>{crumb.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {index < crumbs.length - 1 && (
              <BreadcrumbSeparator className="shrink-0" />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
