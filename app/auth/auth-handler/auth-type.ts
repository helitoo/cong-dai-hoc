import z from "zod";

// Password

export const PasswordSchema = z.object({
  password: z
    .string()
    .min(8, "MK phải có ít nhất 8 ký tự!")
    .max(100, "MK chỉ có tối đa 100 ký tự!")
    .regex(/[A-Z]/, "MK phải chứa chữ hoa!")
    .regex(/[0-9]/, "MK phải chứa chữ số!")
    .regex(/[^A-Za-z0-9]/, "MK phải chứa ký tự đặc biệt!"),
});

export type Password = z.infer<typeof PasswordSchema>;

// Email

export const EmailSchema = z.object({
  email: z.string().email("Email sai"),
});

export type Email = z.infer<typeof EmailSchema>;

export type Metadata = {
  auid: string;
  avt_variant:
    | "pixel"
    | "bauhaus"
    | "ring"
    | "beam"
    | "sunset"
    | "marble"
    | "geometric"
    | "abstract"
    | undefined;
  avt_msg: string;
};

export type AuthRes = {
  code: "success" | "error";
  msg: string | undefined;
};
