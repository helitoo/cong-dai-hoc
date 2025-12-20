"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useLoading } from "@/components/loading";
import { PasswordInput } from "@/components/password-input";
import showToast from "@/components/toastify-wrapper";

import { signIn } from "@/app/auth/auth-handler/auth-handler";

function InputForm({
  name,
  setName,
  password,
  setPassword,
  namePlaceholder,
}: {
  name: string;
  setName: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  namePlaceholder: string;
}) {
  return (
    <div className="space-y-2">
      <Input
        className="w-full"
        placeholder={namePlaceholder}
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      <div className="w-full">
        <div className="relative">
          <PasswordInput onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export default function SigninForm() {
  // Loading init
  const { showLoading, hideLoading } = useLoading();

  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [type, setType] = useState<"email" | "auid">("auid");

  async function onSubmit() {
    showLoading();

    if (!name || !password) {
      showToast({ type: "error", message: "Chưa điền đủ dữ liệu!" });
      hideLoading();
      return;
    }

    const res = await signIn(name, password, type);

    if (res.code === "error") showToast({ type: "error", message: res.msg });
    else showToast({ type: "success", message: "Đăng nhập thành công!" });

    hideLoading();
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-5 w-fit box">
      <div className="box-title">Đăng nhập</div>
      <Tabs
        defaultValue={type}
        onValueChange={(v) => setType(v as "email" | "auid")}
      >
        <TabsList className="bg-transparent">
          <TabsTrigger value="auid">Đăng nhập bằng ID</TabsTrigger>
          <TabsTrigger value="email">Đăng nhập bằng email</TabsTrigger>
        </TabsList>

        <TabsContent value="auid">
          <InputForm
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            namePlaceholder="Nhập ID..."
          ></InputForm>
        </TabsContent>

        <TabsContent value="email">
          <InputForm
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            namePlaceholder="Nhập email..."
          ></InputForm>
        </TabsContent>
      </Tabs>

      <Button type="submit" className="submit-button" onClick={onSubmit}>
        OK
      </Button>
    </div>
  );
}
