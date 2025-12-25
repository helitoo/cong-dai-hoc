import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { fmtDateTime } from "@/lib/formatted-date-time";

import UserAvatar from "@/components/avatar";
import ErrorPage from "@/components/error-page";

import EditProfile from "@/app/topic/nguoi-dung/[auid]/edit-profile";

export default async function Page({
  params,
}: {
  params: Promise<{ auid: string }>;
}) {
  const { auid } = await params;

  // Fetch metadata

  const supabase = await createClient();

  const { data: metadata, error } = await supabase
    .from("profile")
    .select(
      `
      avt_variant,
      avt_msg,
      email,
      is_admin,
      created_at,
      description
    `
    )
    .eq("auid", auid)
    .maybeSingle();

  if (error || !metadata)
    return (
      <ErrorPage code="404" msg="Không tìm thấy người dùng hoặc lỗi mạng" />
    );

  // Returned value
  return (
    <div className="background-box">
      <div className="flex gap-5 justify-evenly ml-5 md:ml-20 mt-10">
        <div className="size-fit">
          <UserAvatar
            msg={metadata.avt_msg}
            variant={metadata.avt_variant}
            isAdmin={metadata.is_admin}
            className="size-20"
          />
        </div>

        <div className="border-l border-l-muted-foreground pl-5 flex flex-col gap-1">
          <h1 className="mb-3 font-semibold text-5xl md:text-6xl text-sky-500 font-montserrat">
            {auid}
          </h1>

          <div className="italic text-muted-foreground">
            {metadata.description}
          </div>

          <div>
            <strong>Email:</strong>{" "}
            <Link href={`mailto:${metadata.email}`}>{metadata.email}</Link>.
          </div>

          <div>
            <strong>Ngày tham gia:</strong> {fmtDateTime(metadata.created_at)}.
          </div>

          <EditProfile
            defaultAuid={auid}
            defaultAvtMsg={metadata.avt_msg}
            defaultAvtVariant={metadata.avt_variant}
            defaultDes={metadata.description ?? undefined}
          />
        </div>
      </div>
    </div>
  );
}
