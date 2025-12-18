import SigninForm from "@/app/auth/dang-nhap/signin-form";
import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  if (await checkAuth()) redirect("/");

  return (
    <div className="flex justify-center items-center size-full ">
      <SigninForm />
    </div>
  );
}
