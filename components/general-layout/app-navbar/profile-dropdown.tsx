"use client";

import UserAvatar from "@/components/avatar";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLoading } from "@/components/loading";
import showToast from "@/components/toastify-wrapper";

import { signOut } from "@/app/auth/auth-handler/signup";
import { Metadata } from "@/app/auth/auth-handler/auth-type";

export default function ProfileDropdown({
  auid,
  avt_variant,
  avt_msg,
  isAdmin,
}: Metadata & { isAdmin: boolean }) {
  const { showLoading, hideLoading } = useLoading();

  async function signOutHandler() {
    showLoading();

    const error = await signOut();

    if (error) {
      showToast({ type: "error", message: error.message });
      showToast({ type: "error", message: "Lỗi! Hãy thử lại!" });
    }

    hideLoading();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          msg={avt_msg}
          variant={avt_variant}
          isAdmin={isAdmin}
          className="size-5"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="button">
          <Link href={`/topic/nguoi-dung/${auid}`}>Thông tin cá nhân</Link>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="button">
          <Link href="/user/my-posts">Bài viết của tôi</Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="button">
          <Link href="/user/favorite-posts">Bài viết yêu thích</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={signOutHandler}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
