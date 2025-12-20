"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";

import ProfileDropdown from "@/components/general-layout/app-navbar/profile-dropdown";
import SigninSignupDirection from "@/components/general-layout/app-navbar/signin-signup-direction";
import AppBreadcrumb from "@/components/general-layout/breadcrumb/app-breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";

import { getMetadata } from "@/app/auth/auth-handler/auth-handler";
import type { Metadata } from "@/app/auth/auth-handler/auth-type";

export default function AppNavbar() {
  const [metadata, setMetadata] = useState<Metadata | undefined>();

  useEffect(() => {
    (async () => {
      const temp = await getMetadata();
      setMetadata(temp);
    })();
  }, []);

  return (
    <header className="flex justify-between items-center p-2 w-full shadow-md z-10 bg-background sticky top-0">
      {/* Left side */}
      <div className="flex items-center gap-2">
        <Image
          src={"/images/logo.png"}
          width={25}
          height={25}
          alt={"Logo"}
          draggable={false}
        />
        <AppBreadcrumb />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ModeToggle />

        {metadata ? (
          <ProfileDropdown
            auid={metadata.auid}
            avt_variant={metadata.avt_variant}
            avt_msg={metadata.avt_msg}
          />
        ) : (
          <SigninSignupDirection />
        )}

        <SidebarTrigger />
      </div>
    </header>
  );
}
