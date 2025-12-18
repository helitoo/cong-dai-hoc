import ShortPost from "@/lib/types/post/short-post";

import PostList from "@/app/topic/[topicId]/post-list";

const data: ShortPost[] = [
  {
    title:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, laboriosam!",
    avatar: {
      message: "Lorem",
      variant: "marble",
    },
    author_id: "Helitoo",
    is_pinned: true,
    post_id: "1",
    created_at: "1/1/2025",
    num_favorite: 10,
  },
  {
    title: "Lorem ipsum dolor sit amet",
    avatar: {
      message: "Lorem",
      variant: "marble",
    },
    author_id: "Helitoo",
    is_pinned: true,
    post_id: "2",
    created_at: "1/1/2025",
    num_favorite: 10,
  },
  {
    title: "Lorem ipsum dolor sit amet",
    avatar: {
      message: "Lorem",
      variant: "marble",
    },
    author_id: "Helitoo",
    is_pinned: false,
    post_id: "3",
    created_at: "1/1/2025",
    num_favorite: 10,
  },
  {
    title: "Lorem ipsum dolor sit amet",
    avatar: {
      message: "Lorem",
      variant: "marble",
    },
    author_id: "Helitoo",
    is_pinned: false,
    post_id: "4",
    created_at: "1/1/2025",
    num_favorite: 10,
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return (
    <div className="background-box flex-col gap-3">
      <div className="text-muted-foreground italic text-sm w-full md:w-[95%] mx-auto border-b border-b-muted-foreground mb-4">
        Có {data.length} kết quả.
      </div>
      <PostList shortPosts={data} />;
    </div>
  );
}
