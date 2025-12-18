import z from "zod";

export const AvatarValidator = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Không được để trống!")
    .max(20, "Tối đa 100 ký tự!"),
  variant: z.enum(["marble", "beam", "pixel", "sunset", "ring", "bauhaus"]),
});

export type Avatar = z.infer<typeof AvatarValidator>;
