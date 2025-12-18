"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Avatar from "boring-avatars";
import { useForm } from "react-hook-form";

import InfoConfirmation from "@/app/user/[id]/edit/info-comfirmation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import Note from "@/components/note";
import { PasswordInput } from "@/components/password-input";
import showToast from "@/components/toastify-wrapper";

import {
  PrivateProfileValidator,
  type PrivateProfile,
} from "@/lib/types/profile/profile";

const tupleInputs = [
  {
    text: { name: "email" as const, label: "Email" },
    check: { name: "show_email" as const, label: "Hiển thị email" },
  },
  {
    text: { name: "fb_url" as const, label: "Link Facebook" },
    check: { name: "show_fb_url" as const, label: "Hiển thị Facebook" },
  },
];

export default function Edit({
  id,
  password,
  avatar,
  email,
  description,
  client_role,
  fb_url,
  school,
  major,
  show_email,
  show_fb_url,
}: PrivateProfile) {
  // Form init
  const form = useForm<PrivateProfile>({
    resolver: zodResolver(PrivateProfileValidator),
    defaultValues: {
      id,
      password,
      avatar,
      email,
      description: description ?? "",
      client_role,
      fb_url,
      school,
      major,
      show_email,
      show_fb_url,
    },
  });

  //
  // Helper
  //
  function isChangePrivateInfo() {
    const values = form.getValues();

    return (
      values.id != id ||
      (values.password.length > 0 && values.password != password) ||
      values.email != email
    );
  }

  //
  // Component
  //
  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Avatar Section */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-sky-500 mb-4">Avatar</h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 space-y-4">
              <FormField
                control={form.control}
                name="avatar.message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span>Thông điệp</span>
                      <Note content="Thông điệp khác nhau sẽ có avatar khác nhau!" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập thông điệp..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar.variant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phong cách</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn kiểu avatar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="marble">Nhòe</SelectItem>
                        <SelectItem value="beam">Thân thiện</SelectItem>
                        <SelectItem value="pixel">Pixel</SelectItem>
                        <SelectItem value="sunset">Bình minh</SelectItem>
                        <SelectItem value="ring">Sóng</SelectItem>
                        <SelectItem value="bauhaus">Trừu tượng</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              <Avatar
                name={form.watch("avatar.message")}
                variant={form.watch("avatar.variant")}
                className="w-32 h-32"
              />
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-sky-500 mb-4">
            Thông tin tài khoản
          </h2>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Tối đa 50 ký tự" {...field} />
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
                  <FormLabel>
                    Mật khẩu mới (nếu muốn đổi mật khẩu thì điền)
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới thiệu bản thân</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tối đa 1000 ký tự"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="university">Đại học</SelectItem>
                      <SelectItem value="college">Cao đẳng</SelectItem>
                      <SelectItem value="highschool">Học sinh</SelectItem>
                      <SelectItem value="teacher">Giáo viên</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* School and Major */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span>Trường Đại học</span>
                      <Note content="Gõ tên tiếng Việt / viết tắt tiếng Anh" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Tối đa 100 ký tự" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span>Chuyên ngành (Đại học)</span>
                      <Note content="Gõ tên tiếng Việt" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Tối đa 100 ký tự" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email và Facebook với checkbox */}
            {tupleInputs.map((item, index) => (
              <div className="flex flex-col md:flex-row gap-4" key={index}>
                <div className="md:w-2/3">
                  <FormField
                    control={form.control}
                    name={item.text.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{item.text.label}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập thông tin..."
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:w-1/3 flex items-center">
                  <FormField
                    control={form.control}
                    name={item.check.name}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="mt-0!">
                          {item.check.label}
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              showToast({ type: "info", message: "Đang phát triển!" })
            }
            className="button"
          >
            Xóa tài khoản
          </Button>

          <InfoConfirmation
            form={form}
            originalId={id}
            isChangePrivateInfo={isChangePrivateInfo()}
          />
        </div>
      </form>
    </Form>
  );
}
