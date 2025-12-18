"use client";

import { signout } from "@/lib/routes";
import { getMetadata, defaultMetadata } from "@/lib/localStorage/metadata";
import type { Metadata } from "@/lib/types/profile/profile";

import Avatar from "boring-avatars";

import { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function ProfileDropdown() {
  // Router init

  const router = useRouter();

  // Metadata

  const [metadata, setMetadata] = useState<Metadata>(defaultMetadata);

  useEffect(() => {
    setMetadata(getMetadata());
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar
          name={metadata.avatar.message}
          variant={metadata.avatar.variant}
          className="size-5 button"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="button">
          <Link href={`/user/${metadata.id}/profile`}>Trang cá nhân</Link>
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
        <DropdownMenuItem className="button">
          <Link href="#">Bình luận yêu thích</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await signout();
            window.location.reload();
            router.push("/");
          }}
        >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
