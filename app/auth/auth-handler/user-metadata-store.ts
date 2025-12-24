import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

export type UserMetadata = {
  auid: string;
  avt_variant: string;
  avt_msg: string;
  expired_at: Date;
};

type UserMetadataStore = {
  metadata?: UserMetadata;

  setMetadata: (m: UserMetadata) => void;
  clear: () => void;

  getMetadata: () => Promise<UserMetadata | undefined>;
};

export const useUserMetadata = create<UserMetadataStore>((set, get) => ({
  metadata: undefined,

  setMetadata: (m) => set({ metadata: m }),

  clear: () => set({ metadata: undefined }),

  getMetadata: async () => {
    const cached = get().metadata;
    const now = new Date();

    // Còn hạn, trả về metadata
    if (cached && cached.expired_at > now) {
      return cached;
    }

    // Thử gia hạn
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user || !session.expires_at) {
      set({ metadata: undefined });
      return undefined;
    }

    // Fetch profile
    const { data: profile, error } = await supabase
      .from("profile")
      .select("auid, avt_variant, avt_msg")
      .eq("uid", session.user.id)
      .single();

    if (error || !profile) {
      set({ metadata: undefined });
      return undefined;
    }

    const metadata: UserMetadata = {
      ...profile,
      expired_at: new Date(session.expires_at * 1000),
    };

    set({ metadata });
    return metadata;
  },
}));
