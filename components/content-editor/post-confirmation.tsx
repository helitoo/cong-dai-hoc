"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import showToast from "@/components/toastify-wrapper";

import { useLoading } from "@/components/loading";
import { createClient } from "@/lib/supabase/server";
import {
  PostMutableMetadata,
  PostMutableMetadataValidator,
} from "@/lib/types/forum/post";
import { getMetadata } from "@/lib/localStorage/metadata";
import { getIdFromTitle } from "@/lib/utils";

export default function PostConfirmation({
  content,
  isAdmin,
}: {
  content: string;
  isAdmin: boolean;
  type?: "post" | "cmt";
}) {
  // Form init
  let form = useForm<PostMutableMetadata>({
    resolver: zodResolver(PostMutableMetadataValidator),
    defaultValues: {
      title: "",
      topic_id: "khac",
      is_pinned: false,
    },
  });

  // Init loading
  const { showLoading, hideLoading } = useLoading();

  // Submit handler
  async function onSubmit(mutableMetadata: PostMutableMetadata) {
    showLoading();

    const { id } = getMetadata();
    const supabase = await createClient();

    const postId = getIdFromTitle(mutableMetadata.title);

    // Check if post exists
    const { data: existingPost } = await supabase
      .from("post")
      .select("1")
      .eq("id", postId)
      .single();

    let error;

    if (existingPost) {
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
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          type="button"
          variant="outline"
          className="submit-button button"
          onClick={() => {}}
        >
          <Button variant="ghost" size="icon">
            <Send className="button-icon text-sky-500!" />
          </Button>
        </Button>
      </AlertDialogTrigger>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center box-title">
                Xác nhận thông tin
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Tối đa 60 ký tự" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_pinned"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mt-0!">Ghim bài viết?</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chủ đề</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn kiểu avatar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isAdmin ? (
                          <SelectItem value="he-thong">Hệ thống</SelectItem>
                        ) : (
                          <></>
                        )}
                        <SelectItem value="tin-ts">Tin Tuyển sinh</SelectItem>
                        <SelectItem value="tin-sv">Tin Sinh viên</SelectItem>
                        <SelectItem value="kien-thuc">Kiến thức</SelectItem>
                        <SelectItem value="khac">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AlertDialogCancel asChild>
              <Button type="submit" className="submit-button button">
                Gửi
              </Button>
            </AlertDialogCancel>
          </AlertDialogContent>
        </form>
      </Form>
    </AlertDialog>
  );
}
