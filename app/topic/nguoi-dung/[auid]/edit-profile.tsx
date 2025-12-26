"use client";

import { Pencil } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";

import Avatar from "boring-avatars";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import { useUserMetadata } from "@/app/auth/auth-handler/user-metadata-store";

import showToast from "@/components/toastify-wrapper";
import { useLoading } from "@/components/loading";
import Note from "@/components/note";

import { supabase } from "@/lib/supabase/client";

import {
  editProfileSchema,
  type EditProfileForm,
} from "@/app/topic/nguoi-dung/[auid]/edit-profile-schema";

type EditProfileProps = {
  defaultAuid: string;
  defaultAvtMsg: string;
  defaultAvtVariant:
    | "pixel"
    | "bauhaus"
    | "ring"
    | "beam"
    | "sunset"
    | "marble"
    | "geometric"
    | "abstract"
    | undefined;
  defaultDes: string;
};

export default function EditProfile({
  defaultAuid,
  defaultAvtMsg,
  defaultAvtVariant,
  defaultDes,
}: EditProfileProps) {
  // Auth user
  const getMetadata = useUserMetadata((s) => s.getMetadata);
  const clearMetadata = useUserMetadata((s) => s.clear);

  const [currAuid, setCurrAuid] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function init() {
      const user = await getMetadata();
      setCurrAuid(user?.auid);
    }
    init();
  }, []);

  // Dialog controller
  const [open, setOpen] = useState(false);

  // Loading screen
  const { showLoading, hideLoading } = useLoading();

  // Form init
  const form = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      auid: defaultAuid,
      avt_msg: defaultAvtMsg,
      avt_variant: defaultAvtVariant,
      description: defaultDes,
      email: undefined,
      password: undefined,
    },
  });

  const avtMsgWatcher = form.watch("avt_msg");
  const avtVariantWatcher = form.watch("avt_variant");

  async function onSubmit(values: EditProfileForm) {
    showLoading();

    // Insert to profile
    const { error: profileError } = await supabase
      .from("profile")
      .update({
        auid: values.auid,
        avt_msg: values.avt_msg,
        avt_variant: values.avt_variant,
        description: values.description,
      })
      .eq("auid", defaultAuid);

    if (profileError) {
      showToast({
        type: "error",
        message: "Cập nhật hồ sơ thất bại!",
      });
      hideLoading();
      return;
    }

    clearMetadata();

    // Insert to auth
    if (values.email || values.password) {
      const { error: authError } = await supabase.auth.updateUser({
        ...(values.email && { email: values.email }),
        ...(values.password && { password: values.password }),
      });

      if (authError) {
        showToast({
          type: "error",
          message: "Cập nhật email hoặc mật khẩu thất bại!",
        });
        hideLoading();
        return;
      }
    }

    showToast({
      type: "success",
      message: "Cập nhật thành công",
    });

    hideLoading();
  }

  return (
    <>
      {currAuid === defaultAuid && (
        <Dialog>
          <DialogTrigger className="submit-button button mt-10 mx-auto flex rounded-full px-5 py-2">
            <Pencil className="size-5 text-white" /> Chỉnh sửa hồ sơ
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="flex gap-5 justify-evenly items-center">
                  <Avatar
                    variant={avtVariantWatcher}
                    name={avtMsgWatcher}
                    className="size-20"
                  />

                  <div className="space-y-2 w-full">
                    {/* Avatar variant */}
                    <FormField
                      control={form.control}
                      name="avt_variant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avatar style</FormLabel>

                          <NativeSelect
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <NativeSelectOption value="pixel">
                              Pixel
                            </NativeSelectOption>
                            <NativeSelectOption value="bauhaus">
                              Bauhaus
                            </NativeSelectOption>
                            <NativeSelectOption value="ring">
                              Ring
                            </NativeSelectOption>
                            <NativeSelectOption value="beam">
                              Beam
                            </NativeSelectOption>
                            <NativeSelectOption value="sunset">
                              Sunset
                            </NativeSelectOption>
                            <NativeSelectOption value="marble">
                              Marble
                            </NativeSelectOption>
                            <NativeSelectOption value="geometric">
                              Geometric
                            </NativeSelectOption>
                            <NativeSelectOption value="abstract">
                              Abstract
                            </NativeSelectOption>
                          </NativeSelect>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Avatar message */}
                    <FormField
                      control={form.control}
                      name="avt_msg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Avatar message{" "}
                            <Note content="Mỗi message khác nhau sẽ có 1 hình dạng khác nhau!" />
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              {...field}
                              maxLength={100}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* AUID */}
                <FormField
                  control={form.control}
                  name="auid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={20} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Viết gì đó thể hiện đẳng cấp bản thân
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} maxLength={200} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email mới</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full submit-button mx-auto">
                  Lưu
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
