"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useBreadcrumb } from "@/components/general-layout/breadcrumb/breadcrumb-provider";
import { PasswordInput } from "@/components/password-input";
import showToast from "@/components/toastify-wrapper";

import { signinHandler } from "@/app/auth/dang-nhap/signin-form";

import { useLoading } from "@/components/loading";
import { signup } from "@/lib/routes";
import {
  CredentialsValidator,
  type Credentials,
} from "@/lib/types/auth/credentials";

export default function SignupForm() {
  // Breadcrump init
  const { setBreadcrumb } = useBreadcrumb();
  const pathname = usePathname();

  useEffect(() => {
    setBreadcrumb(pathname);
  }, []);

  // Loading init
  const { showLoading, hideLoading } = useLoading();

  // Router init
  const router = useRouter();

  // Form definition
  const form = useForm<Credentials>({
    resolver: zodResolver(CredentialsValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit handler
  async function onSubmit(credentials: Credentials) {
    try {
      showLoading();
      await signup(credentials);

      try {
        showLoading();
        await signinHandler(credentials);
        hideLoading();
        showToast({ type: "success", message: "Đăng ký thành công!" });

        // Redirect
        window.location.reload();
        router.push("/");
      } catch {
        hideLoading();
        showToast({
          type: "success",
          message: "Đăng ký thành công! Mời đăng nhập!",
        });
        router.push("/auth/signin");
      }
    } catch {
      hideLoading();
      showToast({ type: "error", message: "Đăng ký thất bại!" });
    }
  }

  // Return component
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center space-y-2 w-[50%] md:w-[30%] box"
      >
        <div className="box-title">Đăng ký</div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
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
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  <PasswordInput {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-5 submit-button">
          OK
        </Button>
      </form>
    </Form>
  );
}
