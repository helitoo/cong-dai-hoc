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

import { useLoading } from "@/components/loading";
import { setMetadata } from "@/lib/localStorage/metadata";
import { signin } from "@/lib/routes";
import {
  CredentialsValidator,
  type Credentials,
} from "@/lib/types/auth/credentials";
import type { Metadata } from "@/lib/types/profile/profile";

// Main signin handler
// For reuse at signup-form
export async function signinHandler(credentials: Credentials) {
  const { payload } = (await signin(credentials)) as { payload: Metadata };
  setMetadata(payload);
}

// Component
export default function SigninForm() {
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

  // Form init
  const form = useForm<Credentials>({
    resolver: zodResolver(CredentialsValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit handler
  async function onSubmit(credentials: Credentials) {
    console.log("ON SUBMIT");
    try {
      showLoading();
      await signinHandler(credentials);
      hideLoading();
      showToast({ type: "success", message: "Chào mừng trở lại!" });

      // Redirect
      window.location.reload();
      router.push("/");
    } catch (err) {
      hideLoading();
      showToast({ type: "error", message: "Lỗi đăng nhập!" });
    }
  }

  // Return component

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center space-y-2 w-[50%] md:w-[30%] box"
      >
        <div className="box-title">Đăng nhập</div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Nhập email / username ..."
                  type="email"
                  {...field}
                />
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
