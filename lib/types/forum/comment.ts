import { z } from "zod";
import { Avatar } from "@/lib/types/profile/avatar";

export type CmtUnmutableData = {
  author_id: string;
  cmt_id: string;
  ref_cmt_id: string | null;
  avatar: Avatar;
  created_at: string;
  num_favorite: number;
};

export const CmtContentValidator = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Không có nội dung!")
    .max(10000, "Tối đa 10000 ký tự!"),
});

export type CmtContent = z.infer<typeof CmtContentValidator>;

export type Cmt = CmtUnmutableData & CmtContent;
