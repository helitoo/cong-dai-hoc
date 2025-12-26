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
  const [currAuid, setCurrAuid] = useState<string | undefined>(undefined);
  const [resolvedAuthorId, setResolvedAuthorId] = useState<string | undefined>(
    authorId
  );
  const [isAdmin, setIsAdmin] = useState(false);

  const getMetadata = useUserMetadata((s) => s.getMetadata);
  const openEditor = useEditorStore((s) => s.openEditor);

  // Get current user
  useEffect(() => {
    async function init() {
      const currUser = await getMetadata();
      setCurrAuid(currUser?.auid);
    }
    init();
  }, []);

  // Auth author
  useEffect(() => {
    if (!resolvedAuthorId) setResolvedAuthorId(currAuid);
  }, [currAuid]);

  // Auth admin
  useEffect(() => {
    if (!currAuid) return;

    async function init() {
      const { data } = await supabase
        .from("profile")
        .select("is_admin")
        .eq("auid", currAuid)
        .single();

      setIsAdmin(data?.is_admin ?? false);
    }

    init();
  }, [currAuid]);

  return (
    <>
      {resolvedAuthorId && resolvedAuthorId === currAuid && (
        <Button
          aria-label="Edit content"
          variant={!triggerLabel ? "ghost" : "outline"}
          size={!triggerLabel ? "icon" : "default"}
          className={className}
          onClick={() =>
            openEditor({
              authorId: resolvedAuthorId,
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
