"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export function PasswordInput({
  placeholder = "Nhập mật khẩu ...",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`pr-10 ${props.className ?? ""}`}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1.5 hover:bg-transparent dark:hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        tabIndex={-1}
      >
        {showPassword ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeClosed className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
