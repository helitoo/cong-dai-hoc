import { z } from "zod";
import { Avatar } from "@/lib/types/profile/avatar";

export type PostUnmutableData = {
  author_id: string;
  post_id: string;
  avatar: Avatar;
  created_at: string;
  num_favorite: number;
};

export const PostContentValidator = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Không có nội dung!")
    .max(60000, "Tối đa 60000 ký tự!"),
});

export type PostContent = z.infer<typeof PostContentValidator>;

export const PostMutableMetadataValidator = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Không có nội dung!")
    .max(60, "Tối đa 60 ký tự!"),
  topic_id: z.enum(["he-thong", "tin-ts", "tin-sv", "kien-thuc", "khac"]),
  is_pinned: z.boolean(),
});

export type PostMutableMetadata = z.infer<typeof PostMutableMetadataValidator>;

export type Post = PostUnmutableData & PostContent & PostMutableMetadata;

export type ShortPost = Omit<Post, "content">;
