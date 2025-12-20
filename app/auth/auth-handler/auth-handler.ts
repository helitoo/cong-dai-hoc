"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/app/auth/auth-handler/auth-error-msgs";

type AuthRes = {
  code: "success" | "error";
  msg: string | undefined;
};

export async function signIn(
  name: string,
  password: string,
  signInType: "auid" | "email"
): Promise<AuthRes> {
  switch (signInType) {
    case "auid": {
      // Look up email
      const { data: profile, error: profileError } = await supabaseClient
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
        await supabaseClient.auth.signInWithPassword({
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
      const { data, error } = await supabaseClient.auth.signInWithPassword({
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

export async function setMetadata(): Promise<Metadata | undefined> {
  let {
    data: { session },
  } = await supabaseClient.auth.getSession();

  // Try to retrieve a new session one time
  if (!session) {
    const { data: refreshed, error: refreshError } =
      await supabaseClient.auth.refreshSession();

    if (refreshError) return undefined;
    session = refreshed.session;
  }

  if (!session?.user) return undefined;

  const metadata = session.user.user_metadata;

  const expiresAt = session.expires_at! * 1000;

  localStorage.setItem(
    "user_metadata",
    JSON.stringify({
      metadata,
      expiresAt,
    })
  );

  return metadata as Metadata;
}

import { Metadata } from "@/app/auth/auth-handler/auth-type";

export async function getMetadata(): Promise<Metadata | undefined> {
  const raw = localStorage.getItem("user_metadata");
  const now = Date.now();

  if (raw) {
    try {
      const { metadata, expiresAt } = JSON.parse(raw);
      if (now < expiresAt) return metadata;
      else localStorage.removeItem("user_metadata");
    } catch {
      localStorage.removeItem("user_metadata");
    }
  }

  // Retrieve a new session
  return await setMetadata();
}
