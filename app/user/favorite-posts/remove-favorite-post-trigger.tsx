"use client";

import { HeartOff } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import { useLoading } from "@/components/loading";
import showToast from "@/components/toastify-wrapper";
import { Button } from "@/components/ui/button";

export default function RemoveFavPostTrigger({ pid }: { pid: string }) {
  const { showLoading, hideLoading } = useLoading();

  async function removeFavPost() {
    showLoading();

    const { data, error } = await supabase
      .from("favorite_post")
      .delete()
      .eq("pid", pid);

    if (error) showToast({ type: "error", message: "Lỗi! Hãy thử lại!" });
    else
      showToast({
        type: "success",
        message: "Đã gỡ bài viết này khỏi mục yêu thích!",
      });

    hideLoading();
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={removeFavPost}
      aria-label="Remove favorite post"
    >
      <HeartOff className="size-5 text-red-500" />
    </Button>
  );
}
