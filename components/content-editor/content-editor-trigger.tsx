"use client";

import { ReactNode, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";

import {
  useEditorStore,
  type ContentEditorProps,
} from "@/components/editor-store";

import {
  useUserMetadata,
  type UserMetadata,
} from "@/app/auth/auth-handler/user-metadata-store";

type ContentEditorTriggerProps = Omit<
  ContentEditorProps,
  "acceptTitling" | "acceptPublicing" | "acceptPinning" | "acceptReferencing"
> & {
  triggerIcon: ReactNode;
  triggerLabel?: string | undefined;
  className?: string;
};

export default function ContentEditorTrigger({
  authorId, // undefined -> Tạo mới bài viết, else: Chỉnh sửa
  defaultPid, // undefined -> Tạo mới bài viết, else: Chỉnh sửa
  defaultTitle, // undifined -> Bài viết giới thiệu bản thân
  topicId,
  refPostId, // undifined -> Không phải comment
  limitContentLength,
  defaultContent,
  triggerIcon,
  triggerLabel = undefined,
  className = "",
}: ContentEditorTriggerProps) {
  // States
  const [user, setUser] = useState<UserMetadata | undefined>(undefined);

  const [isAuthor, setIsAuthor] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const getMetadata = useUserMetadata((s) => s.getMetadata);
  const openEditor = useEditorStore((s) => s.openEditor);

  // Get current user
  useEffect(() => {
    async function init() {
      setUser(await getMetadata());
    }
    init();
  }, []);

  // Auth author and admin
  useEffect(() => {
    async function init() {
      if (!authorId) authorId = user?.auid;
      setIsAuthor(authorId === user?.auid);

      setIsAdmin(
        (
          await supabase
            .from("profile")
            .select("is_admin")
            .eq("auid", authorId)
            .single()
        ).data?.is_admin ?? false
      );
    }
    init();
  }, [user]);

  return (
    <>
      {user && isAuthor && (
        <Button
          aria-label="Edit content"
          variant={!triggerLabel ? "ghost" : "outline"}
          size={!triggerLabel ? "icon" : "default"}
          className={className}
          onClick={() =>
            openEditor({
              authorId,
              defaultPid,
              defaultTitle,
              topicId,
              refPostId,
              limitContentLength,
              defaultContent,
              acceptPublicing: true,
              acceptTitling: true,
              acceptReferencing: true,
              acceptPinning: isAdmin,
            })
          }
        >
          {triggerIcon} {triggerLabel}
        </Button>
      )}
    </>
  );
}
