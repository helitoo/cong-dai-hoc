import { Heart, Link, MessageCircle, Pencil } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import UserAvatar from "@/components/avatar";
import ErrorPage from "@/components/error-page";

import { fmtDateTime } from "@/app/topic/[topicId]/formatted-date-time";
import FavoriteToggle from "@/app/topic/[topicId]/[postId]/favorite-toggle";
import ContentEditorTrigger from "@/components/content-editor/content-editor-trigger";
import { CopyButton } from "@/components/toggle-button/copy-button";

export default async function Page({
  params,
}: {
  params: Promise<{ topicId: string; postId: string }>;
}) {
  // Get params
  const { topicId, postId } = await params;

  const supabase = createClient();

  // Fetch posts
  const { data: post, error } = await supabase
    .from("view_post")
    .select(
      `
      pid,
      title,
      content,
      created_at,
      last_modified,
      accecpt_ref,
      author_id,
      author_avt_variant,
      author_avt_msg,
      author_is_admin`
    )
    .eq("pid", postId)
    .eq("tid", topicId)
    .single();

  if (!post || error)
    return <ErrorPage code="404" msg="Bài viết không tồn tại!" />;

  // Fetch comments
  const { data: comments } = await supabase
    .from("view_post")
    .select(
      `
      pid,
      content,
      last_modified,
      author_id,
      author_avt_variant,
      author_avt_msg,
      author_is_admin`
    )
    .eq("pid", postId)
    .eq("tid", topicId);

  // Returned component
  return (
    <div className="background-box flex flex-col gap-5">
      {/* ===== POST ===== */}
      <article className="box space-y-2">
        {/*  */}
        <header className="flex items-center gap-3">
          <UserAvatar
            variant={post.author_avt_variant}
            msg={post.author_avt_msg}
            isAdmin={post.author_is_admin}
            className="size-10"
          />

          <h1 className="text-xl font-semibold">
            {post.title ?? "(Không có tiêu đề)"}
          </h1>

          <ContentEditorTrigger
            authorId={post.author_id}
            defaultPid={post.pid}
            defaultTitle={post.title}
            topicId={topicId}
            refPostId={undefined}
            limitContentLength={100000}
            defaultContent={post.content}
            triggerIcon={<Pencil className="size-5" />}
          />
        </header>

        {/* Time info */}
        <div className="flex flex-col italic text-muted-foreground text-sm">
          <div>
            <strong>Ngày viết: </strong> {fmtDateTime(post.created_at)}.
          </div>

          <div>
            <strong>Chỉnh sửa lần cuối: </strong>{" "}
            {fmtDateTime(post.last_modified)}.
          </div>
        </div>

        {/* content */}
        <div
          className="tiptap max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Action */}
        <div className="flex justify-around">
          <FavoriteToggle postId={post.pid} />

          <ContentEditorTrigger
            authorId={undefined}
            defaultPid={undefined}
            defaultTitle={undefined}
            topicId={topicId}
            refPostId={post.pid}
            limitContentLength={10000}
            defaultContent={""}
            triggerIcon={<MessageCircle className="size-5" />}
          />

          <CopyButton content={`/topic/${topicId}/${post.pid}`} />
        </div>
      </article>

      {/* Comments */}
      <section className="space-y-3">
        {comments &&
          comments.map((cmt) => (
            <div key={cmt.pid} className="flex gap-3 shadow p-2">
              <div>
                <UserAvatar
                  msg={cmt.author_avt_msg}
                  variant={cmt.author_avt_variant}
                  className="size-5"
                  isAdmin={cmt.author_is_admin}
                />
              </div>

              <div className="flex-1 space-y-1">
                <div className="italic text-muted-foreground text-sm!">
                  {fmtDateTime(cmt.last_modified)}
                </div>

                <div
                  className="tiptap max-w-none"
                  dangerouslySetInnerHTML={{ __html: cmt.content }}
                />

                <div className="flex justify-around">
                  <FavoriteToggle postId={cmt.pid} />

                  <ContentEditorTrigger
                    authorId={undefined}
                    defaultPid={undefined}
                    defaultTitle={undefined}
                    topicId={topicId}
                    refPostId={cmt.pid}
                    limitContentLength={10000}
                    defaultContent={""}
                    triggerIcon={<MessageCircle className="size-5" />}
                  />

                  <CopyButton content={`/topic/${topicId}/${cmt.pid}`} />
                </div>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}
