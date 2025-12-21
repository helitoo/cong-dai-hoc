import { getAuthErrorMessage } from "@/app/auth/auth-handler/auth-error-msgs";
import type { AuthRes } from "@/app/auth/auth-handler/auth-type";
import { supabase } from "@/lib/supabase/client";

export async function signIn(
  name: string,
  password: string,
  signInType: "auid" | "email"
): Promise<AuthRes> {
  switch (signInType) {
    case "auid": {
      // Look up email
      const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select("email")
        .eq("auid", name)
        .single();

      if (profileError || !profile?.email)
        return {
          code: "error",
          msg: "Không tìm thấy người dùng có ID này.",
        };

      // Sign in
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: profile.email,
          password,
        });

      if (signInError || !signInData)
        return {
          code: "error",
          msg: getAuthErrorMessage(signInError?.code),
        };
      else
        return {
          code: "success",
          msg: undefined,
        };
    }

    case "email": {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: name,
        password,
      });

      if (!data || error)
        return {
          code: "error",
          msg: getAuthErrorMessage(error?.code),
        };
      else
        return {
          code: "success",
          msg: undefined,
        };
    }
  }
}
