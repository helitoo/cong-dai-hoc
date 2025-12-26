"use client";

import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useUserMetadata } from "@/app/auth/auth-handler/user-metadata-store";
import { Toggle } from "@/components/ui/toggle";
import showToast from "@/components/toastify-wrapper";

import { supabase } from "@/lib/supabase/client";

const BASE_DELAY = 10_000; // 10s
const PENALTY_DELAY = 15 * 60 * 1000; // 15 phút
const CLICK_THRESHOLD = 4;

export default function FavoriteToggle({ postId }: { postId: string }) {
  const getMetadata = useUserMetadata((s) => s.getMetadata);

  const [auid, setAuid] = useState<string>();
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Fetch user
  useEffect(() => {
    getMetadata().then((u) => setAuid(u?.auid));
  }, [getMetadata]);

  // Fet number of favorite
  useEffect(() => {
    if (!auid) return;

    const init = async () => {
      const [{ count }, { data }] = await Promise.all([
        supabase
          .from("favorite_post")
          .select("*", { count: "exact", head: true })
          .eq("pid", postId),

        supabase
          .from("favorite_post")
          .select("pid")
          .eq("pid", postId)
          .eq("auid", auid)
          .maybeSingle(),
      ]);

      setCount(count ?? 0);
      setActive(!!data);
      setLoaded(true);
    };

    init();
  }, [postId, auid]);

  // Toggle
  const toggle = async () => {
    if (!auid || disabled) return;

    const nextActive = !active;

    setActive(nextActive);
    setCount((c) => (nextActive ? c + 1 : c - 1));

    if (nextActive) {
      await supabase.from("favorite_post").insert({ pid: postId, auid });
    } else {
      await supabase
        .from("favorite_post")
        .delete()
        .eq("pid", postId)
        .eq("auid", auid);
    }

    const nextClick = clickCount + 1;
    const delay = nextClick >= CLICK_THRESHOLD ? PENALTY_DELAY : BASE_DELAY;

    setClickCount(nextClick);
    setDisabled(true);

    showToast({
      type: "info",
      message:
        delay === BASE_DELAY
          ? "Sau 10s nữa mới được click vào nút này!"
          : "Sau 15' nữa mới được click vào nút này!",
    });

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setDisabled(false);
      setClickCount(0);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!loaded) return null;

  return (
    <Toggle
      pressed={active}
      onPressedChange={toggle}
      disabled={disabled || !auid}
      className="flex items-center gap-2"
      aria-label="Favorite content"
    >
      <Heart
        className={`size-5 ${active ? "fill-red-400 text-red-400" : ""}`}
      />
      {auid && <span className="text-sm">{count}</span>}
    </Toggle>
  );
}
