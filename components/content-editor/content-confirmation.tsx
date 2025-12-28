"use client";

import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { type EditorConfirmation } from "@/components/content-editor/content-editor";

import { Send } from "lucide-react";

import Note from "@/components/note";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLoading } from "@/components/loading";
import showToast from "@/components/toastify-wrapper";

import { supabase } from "@/lib/supabase/client";

function getPidFromTitle(title: string): string {
  const random = Math.random().toString(36).slice(2, 7);

  const slug = title
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/\s+/g, "-")
    .toLowerCase();

  return `${slug}-${random}`;
}

type ContentConfirmationProps = {
  form: UseFormReturn<EditorConfirmation>;
  defaultPid: string | undefined;
  acceptTitling: boolean;
  acceptPublicing: boolean;
  acceptPinning: boolean;
  acceptReferencing: boolean;
  refPostId: string | undefined;
  topicId: string;
  limitContentLength: number;
};

export default function ContentConfirmation({
  form,
  defaultPid,
  acceptTitling,
  acceptPublicing,
  acceptPinning,
  acceptReferencing,
  refPostId,
  topicId,
  limitContentLength,
}: ContentConfirmationProps) {
  const { showLoading, hideLoading } = useLoading();

  const content = form.watch("content");

  async function submitHandler(data: EditorConfirmation) {
    showLoading();

    // Get post id
    const pid = defaultPid ?? getPidFromTitle(data.title ?? "unknow");

    // Push post to database
    const { error: postError } = await supabase.from("post").upsert({
      pid,
      content: data.content,
      author_id: data.author_id,
      is_public: data.is_public,
      is_pinned: data.is_pinned,
      ref_post: refPostId,
      accecpt_ref: data.accecpt_ref,
      title: data.title,
    });

    if (postError) {
      showToast({ type: "error", message: postError.message });
      showToast({ type: "error", message: "Đã xảy ra lỗi, hãy thử lại sau." });
      hideLoading();
      return;
    }

    // Push post - topic to database
    const { error: postTopicError } = await supabase.from("post_topic").upsert({
      pid,
      tid: topicId,
    });

    if (postTopicError) {
      showToast({ type: "error", message: postTopicError.message });
      showToast({ type: "error", message: "Đã xảy ra lỗi, hãy thử lại sau." });
      hideLoading();
      return;
    }

    showToast({ type: "success", message: "Đã chia sẻ bài viết!" });

    hideLoading();

    window.location.href = `/topic/${topicId}`;
  }

  // Dialog controller

  const [open, setOpen] = useState(false);

  const onOpenConfirm = async () => {
    if (!content || content.length === 0) {
      showToast({ type: "error", message: "Nội dung trống!" });
      return;
    }

    if (content.length > limitContentLength) {
      showToast({ type: "error", message: "Vượt quá độ dài cho phép!" });
      return;
    }

    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        size="icon"
        variant="ghost"
        onClick={onOpenConfirm}
        aria-label="Create or Edit content"
      >
        <Send className="size-5 text-sky-500" />
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="box-title">Xác nhận thông tin</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(submitHandler, (errors) => {
            console.log("Validation errors on submit:", errors);
            console.log(form.getValues());
            showToast({
              type: "error",
              message: "Kiểm tra thông tin chưa hợp lệ.",
            });
          })}
          className="space-y-3"
        >
          {/* Title */}
          {acceptTitling && (
            <div className="space-y-1">
              <Label className="ml-1">Tiêu đề</Label>
              <Input placeholder="Tiêu đề..." {...form.register("title")} />
            </div>
          )}

          {/* Pin */}
          {acceptPinning && (
            <Controller
              control={form.control}
              name="is_pinned"
              render={({ field }) => (
                <Label className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Ghim bài viết
                </Label>
              )}
            />
          )}

          {/* Public */}
          {acceptPublicing && (
            <Controller
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <Label className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Chia sẻ công khai
                  <Note content="Bài viết công khai cho phép người dùng chưa đăng nhập vẫn xem được" />
                </Label>
              )}
            />
          )}

          {/* Accept ref */}
          {acceptReferencing && (
            <Controller
              control={form.control}
              name="accecpt_ref"
              render={({ field }) => (
                <Label className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Cho phép phản hồi bài viết này
                </Label>
              )}
            />
          )}

          <div className="w-full flex justify-center">
            <Button type="submit" className="submit-button mt-5 mx-auto">
              Chia sẻ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
