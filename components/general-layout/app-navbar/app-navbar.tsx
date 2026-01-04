"use client";

import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";

import ProfileDropdown from "@/components/general-layout/app-navbar/profile-dropdown";
import SigninSignupDirection from "@/components/general-layout/app-navbar/signin-signup-direction";
import AppBreadcrumb from "@/components/general-layout/breadcrumb/app-breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";

import {
  useUserMetadata,
  type UserMetadata,
} from "@/app/auth/auth-handler/user-metadata-store";

import { supabase } from "@/lib/supabase/client";

export default function AppNavbar() {
  // const [user, setUser] = useState<UserMetadata | undefined>(undefined);
  // const [isAdmin, setIsAdmin] = useState(false);
  // const getMetadata = useUserMetadata((s) => s.getMetadata);

  // useEffect(() => {
  //   async function initUser() {
  //     setUser(await getMetadata());
  //   }
  //   initUser();
  // }, []);

  // useEffect(() => {
  //   async function initUser() {
  //     const { data } = await supabase
  //       .from("profile")
  //       .select("is_admin")
  //       .eq("auid", user?.auid);

  //     const isAdmin = data?.[0]?.is_admin ?? false;

  //     setIsAdmin(isAdmin);
  //   }
  //   initUser();
  // }, [user]);

  return (
    <header className="flex justify-between items-center p-2 w-full shadow-md z-10 bg-background sticky top-0">
      {/* Left side */}
      <div className="flex items-center gap-2">
        <Link href="/" className="button">
          <Image
            src={"/images/logo.png"}
            width={25}
            height={25}
            alt={"Logo"}
            draggable={false}
          />
        </Link>

        <AppBreadcrumb />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 pr-2">
        <ModeToggle />

        {/* {user ? (
          <ProfileDropdown
            auid={user.auid}
            avt_variant={
              user.avt_variant as
                | "pixel"
                | "bauhaus"
                | "ring"
                | "beam"
                | "sunset"
                | "marble"
                | "geometric"
                | "abstract"
                | undefined
            }
            avt_msg={user.avt_msg}
            isAdmin={isAdmin}
          />
        ) : (
          <SigninSignupDirection />
        )} */}

        <SidebarTrigger />
      </div>
    </header>
  );
}
