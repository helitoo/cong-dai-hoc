import { Pin, Link as Chain, Heart } from "lucide-react";

import shortPost from "@/lib/types/post/short-post";

import Avatar from "boring-avatars";

import Link from "next/link";

import { CopyUrlButton } from "@/components/toggle-button/copy-button";

export default function PostList({ shortPosts }: { shortPosts: shortPost[] }) {
  return (
    <>
      {shortPosts.map((post, index) => (
        <div
          className={`relative flex posts-center justify-evenly mx-auto w-full md:w-[95%] gap-5 ${
            post.is_pinned ? "box" : "p-5 rounded-2xl border-2 bg-background"
          }`}
          key={post.post_id}
        >
          {post.is_pinned ? (
            <Pin className="absolute -top-2 left-2 size-5 rounded-full bg-background" />
          ) : (
            <></>
          )}

          {/* General info */}
          <div className="flex flex-col flex-1 min-w-0">
            <Link
              href="#"
              className="text-lg font-semibold truncate max-w-full button"
            >
              {post.title}
            </Link>
            <div className="text-sm italic text-muted-foreground truncate">
              {post.created_at}
            </div>
          </div>

          {/* Avatar */}
          <Link href={`#`} className="button">
            <Avatar
              name={post.avatar.message}
              variant={post.avatar.variant}
              className="size-10"
            />
          </Link>

          {/* Favorite */}
          <div className="flex posts-center gap-1">
            <Heart className="button-icon" />
            <div>{post.num_favorite}</div>
          </div>

          {/* Copy URL */}
          <CopyUrlButton id={post.post_id} />
        </div>
      ))}
    </>
  );
}
