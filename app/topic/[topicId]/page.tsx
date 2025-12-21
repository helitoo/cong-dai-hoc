"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useLoading } from "@/components/loading";

import { supabaseClient } from "@/lib/supabase/client";

type PostMetadata = {
  pid: string;
  title: string;
  last_modified: string;
  author_id: string;
  is_pinned: boolean;
};

const NUM_OF_POST_EACH_PAGE = 10;

export default function Page({ params }: { params: { topicId: string } }) {
  const { showLoading, hideLoading } = useLoading();

  const { topicId } = params;

  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page, topicId]);

  async function fetchPosts() {
    showLoading();

    const from = (page - 1) * NUM_OF_POST_EACH_PAGE;
    const to = from + NUM_OF_POST_EACH_PAGE - 1;

    const { data, count, error } = await supabaseClient
      .from("post")
      .select(
        `
        pid,
        title,
        last_modified,
        author_id,
        is_pinned,
        post_topic!inner(tid)
      `,
        { count: "exact" }
      )
      .eq("post_topic.tid", topicId)
      .order("is_pinned", { ascending: false })
      .order("last_modified", { ascending: false })
      .range(from, to);

    if (!error) {
      setPosts(data as PostMetadata[]);
      setTotalPages(Math.ceil((count ?? 0) / NUM_OF_POST_EACH_PAGE));
    }

    hideLoading();
  }

  return (
    <div className="background-box flex-col gap-3">
      {/* Header */}
      <div className="text-muted-foreground italic text-sm w-full md:w-[95%] mx-auto border-b border-b-muted-foreground mb-4">
        Có {posts.length} kết quả.
      </div>

      {/* Post list */}
      <div className="space-y-3">
        {posts.length &&
          posts.map((post) => (
            <div
              key={post.pid}
              className="border rounded-md p-3 flex justify-between"
            >
              <div>
                <div className="font-medium">
                  {post.pid}
                  {post.is_pinned && (
                    <span className="ml-2 text-xs text-sky-500">📌 Pin</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Chỉnh sửa lần cuối{" "}
                  {new Date(post.last_modified).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="ghost"
            size="icon"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="button-icon" />
          </Button>

          <span className="text-sm">
            {page} / {totalPages}
          </span>

          <Button
            variant="ghost"
            size="icon"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="button-icon" />
          </Button>
        </div>
      </div>
    </div>
  );
}
