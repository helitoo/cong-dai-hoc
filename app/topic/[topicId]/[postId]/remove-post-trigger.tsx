"use client";

import { Trash } from "lucide-react";

import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useUserMetadata } from "@/app/auth/auth-handler/user-metadata-store";

import { supabase } from "@/lib/supabase/client";

import { useLoading } from "@/components/loading";
import showToast from "@/components/toastify-wrapper";

export default function RemovePostTrigger({
  postId,
  authorId,
  topicId,
}: {
  postId: string;
  authorId: string;
  topicId: string;
}) {
  const [auid, setAuid] = useState<string | undefined>(undefined);
  const getMetadata = useUserMetadata((s) => s.getMetadata);
  const { showLoading, hideLoading } = useLoading();

  // Init user metadata
  useEffect(() => {
    getMetadata().then((u) => setAuid(u?.auid));
  }, [getMetadata]);

  // Remove post
  async function removePost() {
    showLoading();

    const { error } = await supabase
      .from("post")
      .delete()
      .eq("pid", postId)
      .select()
      .single();

    if (error) showToast({ type: "error", message: "Lỗi! Hãy thử lại sau!" });
    else showToast({ type: "success", message: "Đã xóa bài viết!" });

    window.location.href = `/topic/${topicId}`;

    hideLoading();
  }

  return (
    <>
      {auid === authorId && (
        <AlertDialog>
          <AlertDialogTrigger className="button" aria-label="Remove content">
            <Trash className="size-5 text-red-500" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn muốn xóa bài viết này?</AlertDialogTitle>
              <AlertDialogDescription>
                Sau khi bị xóa, bài viết này cũng như các bình luận phản hồi nó
                cũng sẽ bị xóa và không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Đóng</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500! text-white"
                onClick={removePost}
              >
                Xóa bài viết
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
