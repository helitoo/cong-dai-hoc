import z from "zod";
import { EmailValidator } from "@/lib/types/auth/email";
import { PasswordValidator } from "@/lib/types/auth/password";

export const CredentialsValidator = z.object({
  ...EmailValidator.shape,
  ...PasswordValidator.shape,
});

export type Credentials = z.infer<typeof CredentialsValidator>;
