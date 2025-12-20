import { supabaseClient } from "@/lib/supabase/client";

import { getAuthErrorMessage } from "@/app/auth/auth-handler/auth-error-msgs";
import type { AuthRes } from "@/app/auth/auth-handler/auth-type";

export async function signUp(
  email: string,
  password: string
): Promise<AuthRes> {
  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
  });

  if (!data || error)
    return { code: "error", msg: getAuthErrorMessage(error?.code) };
  else return { code: "success", msg: undefined };
}

export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  return error;
}

const MAU_LIMIT = 40000;

export async function signUpWithMauGuard(
  email: string,
  password: string
): Promise<AuthRes> {
  // Get current MAU
  const { data: mau, error } = await supabaseClient.rpc("get_current_mau");

  if (error)
    return {
      code: "error",
      msg: "Hệ thống đang bị lỗi. Hãy thử lại sau.",
    };

  // If overate, push to queue
  if (mau >= MAU_LIMIT) {
    await supabaseClient.from("signup_queue").insert({
      email,
      password,
    });

    return {
      code: "success",
      msg: "Yêu cầu đăng ký đang được duyệt.",
    };
  }

  return signUp(email, password);
}
