"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import showToast from "@/components/toastify-wrapper";

import { useLoading } from "@/components/loading";
import { createClient } from "@/lib/supabase/server";
import {
  PostMutableMetadata,
  PostMutableMetadataValidator,
} from "@/lib/types/forum/post";
import { getMetadata } from "@/lib/localStorage/metadata";
import { getIdFromTitle } from "@/lib/utils";

export default function CmtConfirmation({ content }: { content: string }) {
  // Init loading
  const { showLoading, hideLoading } = useLoading();

  // Submit handler
  async function onSubmit() {
    showLoading();

    const { id } = getMetadata();
    const supabase = await createClient();

    const postId = getIdFromTitle(mutableMetadata.title);

    // Check if post exists
    const { data: existingCmt } = await supabase
      .from("comment")
      .select("1")
      .eq("id", postId)
      .single();

    let error;

    if (existingCmt) {
      // Update existing post
      const result = await supabase
        .from("post")
        .update({
          title: mutableMetadata.title,
          is_pinned: mutableMetadata.is_pinned,
          topic_id: mutableMetadata.topic_id,
          content,
        })
        .eq("id", postId);
      error = result.error;
    } else {
      // Insert new post
      const result = await supabase.from("post").insert([
        {
          id: postId,
          title: mutableMetadata.title,
          author_id: id,
          is_pinned: mutableMetadata.is_pinned,
          topic_id: mutableMetadata.topic_id,
          content,
        },
      ]);
      error = result.error;
    }

    if (error) {
      showToast({ type: "error", message: "Lỗi!" });
      hideLoading();
      return;
    }

    showToast({ type: "success", message: "Đã công khai!" });
    hideLoading();
  }

  return (
    <Button variant="ghost" size="icon" onClick={async () => await onSubmit()}>
      <Send className="button-icon text-sky-500!" />
    </Button>
  );
}
