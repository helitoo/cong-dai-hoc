"use client";

import { Clipboard, Link } from "lucide-react";

import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

import ToggleButton from "@/components/toggle-button/toggle-button";

type CopyButtonProps = {
  content: string;
  icon?: ReactNode;
  className?: string;
};

export function CopyButton({
  content,
  icon = <Clipboard className="button-icon" />,
  className = "",
}: CopyButtonProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <ToggleButton
      className={className}
      notExeIcon={icon}
      onClick={handleCopy}
    />
  );
}

export function CopyUrlButton({ id = "" }: { id?: string }) {
  const pathname = usePathname();
  const fullUrl = `${window.location.origin}${pathname}${id ? `/${id}` : ""}`;

  return (
    <CopyButton content={fullUrl} icon={<Link className="button-icon" />} />
  );
}
