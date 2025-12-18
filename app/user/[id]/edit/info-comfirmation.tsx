"use client";

import { PasswordInput } from "@/components/password-input";
import showToast from "@/components/toastify-wrapper";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useLoading } from "@/components/loading";
import { setMetadata } from "@/lib/localStorage/metadata";
import { createClient } from "@/lib/supabase/client";
import { type PrivateProfile } from "@/lib/types/profile/profile";
import { getExactIndustry3FromName } from "@/lib/universities/convertors/industry-l3";
import { getExactSchoolFromName } from "@/lib/universities/convertors/schools";

import bcrypt from "bcryptjs";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

export default function InfoConfirmation({
  form,
  originalId,
  isChangePrivateInfo,
}: {
  form: UseFormReturn<PrivateProfile>;
  originalId: string;
  isChangePrivateInfo: boolean;
}) {
  // Init loading
  const { showLoading, hideLoading } = useLoading();

  // Init confirm password
  const [confirmPassword, setConfirmPassword] = useState("");

  //  Normalize school and major infor
  let exactSchool = { id: "", name: "" };
  let exactMajor = { id: "", name: "" };

  //
  // Helper
  // Return true if there is a duplicated ID
  //
  async function isDup(id: string, email: string) {
    async function isDupField(colName: "id" | "email", targetValue: string) {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("profile")
        .select("1")
        .eq(colName, targetValue)
        .maybeSingle();

      return !data || error;
    }

    const [isDupId, isDupEmail] = await Promise.all([
      isDupField("id", id),
      isDupField("email", email),
    ]);

    return [isDupId, isDupEmail];
  }

  //
  // Pre-submit handler
  //
  async function preOnSubmit() {
    showLoading();

    const values = form.getValues();

    // Check duplicated id / email

    const [isDupId, isDupEmail] = await isDup(values.id, values.email);

    if (isDupId && isDupEmail) {
      showToast({ type: "error", message: "ID & EMAIL đã tồn tại!" });
      hideLoading();
      return;
    } else if (isDupId) {
      showToast({ type: "error", message: "ID đã tồn tại!" });
      hideLoading();
      return;
    } else if (isDupEmail) {
      showToast({ type: "error", message: "EMAIL đã tồn tại!" });
      hideLoading();
      return;
    }

    if (values.school) exactSchool = getExactSchoolFromName(values.school);
    if (values.major) exactMajor = getExactIndustry3FromName(values.major);

    form.setValue("school", exactSchool.name ?? "(Không có)");
    form.setValue("major", exactMajor.name ?? "(Không có)");

    hideLoading();
  }

  //
  // Submit handler
  //
  async function onSubmit() {
    showLoading();

    const supabase = await createClient();

    // Check password (if needed)
    if (isChangePrivateInfo) {
      const { data, error } = await supabase
        .from("profile")
        .select("hashed_password")
        .eq("id", originalId)
        .single();

      if (!data || error) {
        showToast({ type: "error", message: "Lỗi mạng!" });
        hideLoading();
        return;
      }

      const isValidPassword = bcrypt.compareSync(
        confirmPassword,
        data.hashed_password
      );

      if (!isValidPassword) {
        showToast({ type: "error", message: "Mật khẩu cũ SAI!" });
        hideLoading();
        return;
      }
    }

    const values = form.getValues();

    // Get data which need updated

    const updateData: any = {
      email: values.email,
      avatar_variant: values.avatar.variant,
      avatar_message: values.avatar.message,
      id: values.id,
      description: values.description ?? null,
      client_role: values.client_role,
      fb_url: values.fb_url,
      show_email: values.show_email,
      show_fb_url: values.show_fb_url,
    };

    if (exactSchool.id) updateData.school = exactSchool.id;

    if (exactMajor.id) {
      updateData.industry_l1_id = exactMajor.id.slice(0, 3);
      updateData.industry_l2_id = exactMajor.id.slice(3, 5);
      updateData.industry_l3_id = exactMajor.id.slice(5, 7);
    }

    if (values.password)
      updateData.hashed_password = bcrypt.hashSync(values.password, 10);

    // Update

    const { error } = await supabase
      .from("profile")
      .update(updateData)
      .eq("id", originalId);

    if (error) {
      showToast({ type: "error", message: "Lỗi mạng!" });
      hideLoading();
      return;
    }

    // Async

    setMetadata({ id: values.id, avatar: values.avatar });
    originalId = values.id;
    showToast({ type: "success", message: "Cập nhật thành công!" });
    hideLoading();
  }

  //
  // Component
  //
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="submit-button button"
          onClick={() => preOnSubmit()}
        >
          Lưu
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center box-title">
            Xác nhận thông tin
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <FormLabel>Trường Đại học</FormLabel>
            <Input value={form.watch("school")} disabled />
          </div>

          <div className="flex flex-col space-y-2">
            <FormLabel>Chuyên ngành (Đại học)</FormLabel>
            <Input value={form.watch("major")} disabled />
          </div>

          <div className="text-muted-foreground italic">
            Nếu có sai sót, hãy nhập lại tên trường / ngành đầy đủ hơn.
          </div>

          {isChangePrivateInfo ? (
            <div className="flex flex-col space-y-2">
              <FormLabel>Nhập mật khẩu cũ</FormLabel>
              <PasswordInput
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button
            type="button"
            onClick={() => onSubmit()}
            className="submit-button button"
          >
            Lưu
          </Button>
          <AlertDialogCancel asChild>
            <Button type="button" className="submit-button button">
              Đóng
            </Button>
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
