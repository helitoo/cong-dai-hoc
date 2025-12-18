import z from "zod";

export const PasswordValidator = z.object({
  password: z
    .string()
    .min(8, "MK phải có ít nhất 8 ký tự!")
    .max(100, "MK chỉ có tối đa 100 ký tự!")
    .regex(/[A-Z]/, "MK phải chứa chữ hoa!")
    .regex(/[0-9]/, "MK phải chứa chữ số!")
    .regex(/[^A-Za-z0-9]/, "MK phải chứa ký tự đặc biệt!"),
});

export type Password = z.infer<typeof PasswordValidator>;
