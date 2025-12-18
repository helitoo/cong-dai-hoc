"use client";

import { CircleUserRound } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";

import Link from "next/link";

import DropdownTriggerBtn from "@/components/dropdown-trigger-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SignupDirection() {
  return (
    <div className="flex items-start justify-center gap-1 text-sm">
      <span className="italic text-muted-foreground">Chưa có tài khoản?</span>{" "}
      <Link href="/auth/dang-ky" className="link">
        Đăng ký
      </Link>
    </div>
  );
}

function SigninDirection() {
  return (
    <Link href="/auth/dang-nhap" className="link text-sm">
      Đăng nhập
    </Link>
  );
}

export default function SigninSignupDirection() {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DropdownTriggerBtn variant="ghost" size="icon">
              <CircleUserRound className="button-icon" />
            </DropdownTriggerBtn>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>
              <SignupDirection />
            </DropdownMenuItem>

            <DropdownMenuItem>
              <SigninDirection />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-start justify-center gap-2">
          <SignupDirection />
          <SigninDirection />
        </div>
      )}
    </>
  );
}
