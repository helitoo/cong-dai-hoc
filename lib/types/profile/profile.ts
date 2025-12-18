import z from "zod";

import { PasswordValidator } from "@/lib/types/auth/password";
import { EmailValidator } from "@/lib/types/auth/email";
import { AvatarValidator } from "@/lib/types/profile/avatar";

// Metadata
// Storaged in Local storage, public data

export const MetadataValidator = z.object({
  id: z.string().min(1, "Không được để trống").max(50, "Tối đa 50 ký tự"),
  avatar: AvatarValidator,
});

export type Metadata = z.infer<typeof MetadataValidator>;

// Private info
// Storaged in database, need to fetch

export const NonMetaValidator = z.object({
  ...EmailValidator.shape,
  description: z.string().max(1000, "Tối đa 1000 ký tự").optional(),
  server_role: z.enum(["client", "admin"]),
  client_role: z.enum([
    "university",
    "college",
    "highschool",
    "teacher",
    "other",
  ]),
  fb_url: z.string().url("URL sai").max(200, "Tối đa 200 ký tự").optional(),
  school: z.string().max(50, "Tối đa 100 ký tự").optional(),
  major: z.string().max(100, "Tối đa 100 ký tự").optional(),
});

export type NonMeta = z.infer<typeof NonMetaValidator>;

// PublicProfile
// Can be show to everyone

export const PublicProfilealidator = z.object({
  ...MetadataValidator.shape,
  ...NonMetaValidator.shape,
});

export type PublicProfile = z.infer<typeof PublicProfilealidator>;

// PrivateProfile
// Only users who is authed can access their private profile's values

export const PrivateProfileValidator = PublicProfilealidator.omit({
  server_role: true,
}).extend({
  ...PasswordValidator.shape,
  show_email: z.boolean(),
  show_fb_url: z.boolean(),
});

export type PrivateProfile = z.infer<typeof PrivateProfileValidator>;
