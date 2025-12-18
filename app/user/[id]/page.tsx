import {
  ShieldBan,
  Pencil,
  Mail,
  Facebook,
  School,
  LibraryBig,
} from "lucide-react";
import Avatar from "boring-avatars";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkAuth } from "@/lib/auth";

import Profile from "@/app/user/[id]/profile";

// Helper function
function getClientRoleName(client_role: string) {
  switch (client_role) {
    case "university":
      return "Sinh viên";
    case "college":
      return "Cao đẳng";
    case "highschool":
      return "Học sinh";
    case "teacher":
      return "Giáo viên";
    default:
      return "Khác";
  }
}

//
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("view_showed_profile")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("404");

  const isAuthed = await checkAuth(id);

  return (
    <div className="background-box justify-center pt-25! md:pt-30!">
      <Profile id={id} />
      <div className="relative flex box w-[90%] h-fit ml-5">
        <Avatar
          name={data.avatar_message}
          variant={data.avatar_variant}
          className="absolute top-0 -translate-x-1/2 -translate-y-1/2 size-20 md:size-30"
        />

        {isAuthed ? (
          <Link
            href={`/user/${id}/profile/edit`}
            className="absolute top-2 right-2 button"
          >
            <Pencil />
          </Link>
        ) : (
          <></>
        )}

        <div className="pl-15 md:pl-20 text-justify">
          {/* Name and server role */}
          <div className="flex items-center gap-2 text-5xl text-sky-400 font-semibold">
            {id}
            {data.server_role === "admin" ? (
              <ShieldBan className="size-6! text-muted-foreground!" />
            ) : (
              <></>
            )}
          </div>

          <div className="mt-1 text-sm italic text-muted-foreground">
            {getClientRoleName(data.client_role)}
          </div>

          {/* Contact infor */}
          <ul className="flex gap-5 mt-1 text-sm">
            {/* Email */}
            {data.email ? (
              <li>
                <Link
                  href={`mailto:${data.email}`}
                  target="_blank"
                  className="flex gap-2 items-center button"
                >
                  <Mail className="size-5" />
                  <span className="truncate">{data.email}</span>
                </Link>
              </li>
            ) : (
              <></>
            )}

            {/* Facebook */}
            {data.fb_url ? (
              <li>
                <Link
                  href={data.fb_url}
                  target="_blank"
                  className="flex gap-2 items-center button"
                >
                  <Facebook className="size-5" />
                  <span className="truncate">
                    {data.fb_url.match(/[^/]+$/)?.[0] ?? data.fb_url}
                  </span>
                </Link>
              </li>
            ) : (
              <></>
            )}
          </ul>

          {/* Education */}
          <ul className="flex gap-5 mb-5 mt-1 text-sm italic text-muted-foreground">
            {/* School */}
            {data.school ? (
              <li className="flex gap-2 items-center">
                <School className="size-5" />
                {data.school}
              </li>
            ) : (
              <></>
            )}

            {/* Major */}
            {data.major ? (
              <li className="flex gap-2 items-center">
                <LibraryBig className="size-5" />
                {data.major}
              </li>
            ) : (
              <></>
            )}
          </ul>

          <div className="text-justify text-wrap">{data.description}</div>
        </div>
      </div>
    </div>
  );
}
