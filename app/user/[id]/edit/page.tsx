import { checkAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import Edit from "@/app/user/[id]/edit/edit";

//
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!(await checkAuth(id))) throw new Error("401");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("view_edit_profile")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("404");

  return (
    <div className="background-box">
      <div className="box w-full max-w-4xl mx-auto">
        <h1 className="box-title">Sửa hồ sơ</h1>
        <Edit
          id={data.id}
          password=""
          description={data.description}
          client_role={data.client_role}
          email={data.email}
          fb_url={data.fb_url}
          school={data.school}
          major={data.major}
          avatar={{
            message: data.avatar_message,
            variant: data.avatar_variant,
          }}
          show_email={data.show_email}
          show_fb_url={data.show_fb_url}
        />
      </div>
    </div>
  );
}
