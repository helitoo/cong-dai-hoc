"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useLoading } from "@/components/loading";
import { PasswordInput } from "@/components/password-input";
import showToast from "@/components/toastify-wrapper";

import { signUp } from "@/app/auth/auth-handler/auth-handler";
import { EmailSchema, PasswordSchema } from "@/app/auth/auth-handler/auth-type";

const SignUpSchema = z.object({
  email: EmailSchema.shape.email,
  password: PasswordSchema.shape.password,
});

type SignUpCredentials = z.infer<typeof SignUpSchema>;

export default function SignupForm() {
  // Loading init
  const { showLoading, hideLoading } = useLoading();

  // Form definition
  const form = useForm<SignUpCredentials>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit handler
  async function onSubmit(credentials: SignUpCredentials) {
    showLoading();

    console.log(credentials);

    const res = await signUp(credentials.email, credentials.password);

    if (res.code === "success")
      showToast({
        type: "success",
        message:
          "Hệ thống đã gửi 1 mail đến email của bạn để xác thực, hãy kiểm tra mailbox của mình.",
      });
    else
      showToast({
        type: "error",
        message: res.msg,
      });

    hideLoading();
  }

  // Return component
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center space-y-5 w-fit box"
      >
        <div className="box-title">Đăng ký</div>

        <div className="space-y-2 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Nhập email ..." type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <PasswordInput {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <p className="italic text-sm text-muted-foreground max-w-[320px]">
          Chỉ đăng ký tài khoản nếu bạn đã đọc và đồng ý với{" "}
          <Link
            className="text-sky-500 hover:underline gap-0"
            href={"/he-thong/dksd"}
          >
            Điều khoản sử dụng của Cổng Đại học
          </Link>
          .
        </p>

        <Button type="submit" className="submit-button">
          OK
        </Button>
      </form>
    </Form>
  );
}
