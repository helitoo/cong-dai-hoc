import "./globals.css";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";

import { SidebarProvider } from "@/components/ui/sidebar";

import { LoadingProvider } from "@/components/loading";
import { ThemeProvider } from "@/components/theme-provider";
import FloatingEditor from "@/components/content-editor/floating-editor";

import { BreadcrumbProvider } from "@/components/general-layout/breadcrumb/breadcrumb-provider";
import CrumbInit from "@/components/general-layout/breadcrumb/crumb-init";

import AppNavbar from "@/components/general-layout/app-navbar/app-navbar";
import AppSidebar from "@/components/general-layout/app-sidebar";
import Footer from "@/components/general-layout/footer";
import ScrollToTopButton from "@/components/general-layout/scroll-to-top";

// export const metadata: Metadata = {
//   title: "Cổng Đại học",
//   description: "Hệ thống tra cứu và phân tích thông tin tuyển sinh vào Đại học tại Việt Nam",
// };

export const metadata: Metadata = {
  title: {
    default: "Cổng Đại học",
    template: "%s | Cổng Đại học",
  },
  description:
    "Hệ thống tra cứu và phân tích thông tin tuyển sinh vào Đại học tại Việt Nam",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className="overflow-y-scroll!">
      <body className={`${montserrat.variable} antialiased`}>
        <LoadingProvider>
          <BreadcrumbProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <div className="min-h-screen w-full flex">
                  <ToastContainer />
                  <AppSidebar />
                  <div className="flex flex-col flex-1 w-0">
                    <AppNavbar />
                    <ScrollToTopButton />
                    <CrumbInit />
                    <FloatingEditor />
                    <div className="flex-1 overflow-y-auto">{children}</div>
                    <Footer />
                  </div>
                </div>
              </SidebarProvider>
            </ThemeProvider>
          </BreadcrumbProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
