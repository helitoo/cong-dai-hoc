import { Metadata } from "@/app/auth/auth-handler/auth-type";
import { supabaseClient } from "@/lib/supabase/client";

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
