import { ChevronLeft, ChevronRight, CirclePlus } from "lucide-react";

import { fmtDateTime } from "@/lib/formatted-date-time";

import Link from "next/link";

import UserAvatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ContentEditorTrigger from "@/components/content-editor/content-editor-trigger";
import ErrorPage from "@/components/error-page";

import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 10;

export default async function PostList({
  params,
  searchParams,
}: {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { topicId } = await params;

  if (!["he-thong", "tin-sv", "tin-ts", "kien-thuc"].includes(topicId))
    return <ErrorPage code="404" msg="Chủ đề không tồn tại!" />;

  const page = Math.max(1, Number((await searchParams).page ?? 1));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const { data, count } = await supabase
    .from("view_post")
    .select(
      `
      pid,
      title,
      last_modified,
      tids,
      is_pinned,
      author_id,
      author_avt_variant,
      author_avt_msg,
      author_is_admin`,
      { count: "exact" }
    )
    .contains("tids", topicId)
    .eq("ref_post", null)
    .range(from, to);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="background-box flex-col gap-3">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-muted-foreground italic text-sm">
          Có {count ?? 0} kết quả.
        </div>

        <ContentEditorTrigger
          authorId={undefined}
          defaultPid={undefined}
          defaultTitle={undefined}
          topicId={topicId}
          refPostId={undefined}
          limitContentLength={100000}
          defaultContent={""}
          triggerIcon={<CirclePlus className="size-5" />}
          triggerLabel="Thêm bài viết mới"
        />
      </div>

      <div className="space-y-1">
        {data?.map((post) => (
          <section
            key={post.pid}
            className="py-3 px-5 rounded-2xl border-2 bg-background flex flex-col"
          >
            <header className="flex justify-between items-center gap-3">
              {" "}
              {/* Avatar */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/topic/nguoi-dung/${post.author_id}`}>
                    <UserAvatar
                      msg={post.author_avt_msg}
                      variant={post.author_avt_variant}
                      className="size-5"
                      isAdmin={post.author_is_admin}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {post.author_is_admin ? "Admin " : ""}
                    {post.author_id}
                  </p>
                </TooltipContent>
              </Tooltip>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/topic/${topicId}/${post.pid}`}
                  className="block truncate max-w-full font-semibold"
                >
                  {post.is_pinned && (
                    <span className="text-sky-500 mr-1">📌</span>
                  )}
                  {post.title ?? "(Không có tiêu đề)"}
                </Link>
              </div>
              <div className="text-sm italic text-muted-foreground">
                {fmtDateTime(post.last_modified)}
              </div>
            </header>

            <div className="flex gap-1 flex-wrap">
              {post.tids.map((tid: string) => (
                <Link
                  href={`/topic/${tid}`}
                  className="p-1 rounded bg-sky-500 text-white"
                >
                  {tid}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 py-4">
        <Button asChild variant="ghost" size="icon" disabled={page === 1}>
          <Link href={`?page=${page - 1}`}>
            <ChevronLeft />
          </Link>
        </Button>

        <span>
          {page} / {totalPages}
        </span>

        <Button
          asChild
          variant="ghost"
          size="icon"
          disabled={page === totalPages}
        >
          <Link href={`?page=${page + 1}`}>
            <ChevronRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
