import { z } from "zod";

import { PasswordSchema } from "@/app/auth/auth-handler/auth-type";

export const editProfileSchema = z.object({
  auid: z.string().min(1).max(20),
  avt_msg: z.string().min(1).max(100),
  avt_variant: z.enum([
    "pixel",
    "bauhaus",
    "ring",
    "beam",
    "sunset",
    "marble",
    "geometric",
    "abstract",
  ]),
  description: z.string().max(200).optional(),
  email: z.email().optional(),
  password: PasswordSchema.shape.password.optional(),
});

export type EditProfileForm = z.infer<typeof editProfileSchema>;
