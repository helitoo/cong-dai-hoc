import z from "zod";

export const EmailValidator = z.object({
  email: z.string().email("Email sai"),
});

export type Email = z.infer<typeof EmailValidator>;
