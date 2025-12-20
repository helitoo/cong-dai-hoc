"use client";

import Avatar from "boring-avatars";

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

import { signOut } from "@/app/auth/auth-handler/auth-handler";
import { Metadata } from "@/app/auth/auth-handler/auth-type";

export default function ProfileDropdown({
  auid,
  avt_variant,
  avt_msg,
}: Metadata) {
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
        <Avatar
          name={avt_msg}
          variant={avt_variant}
          className="size-5 button"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="button">
          <Link href={`/user/${auid}/profile`}>Trang cá nhân</Link>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="button">
          <Link href="#">Bài viết của tôi</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="button">
          <Link href="#">Code của tôi</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="button">
          <Link href="#">Bài viết yêu thích</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={signOutHandler}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
