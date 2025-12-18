"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Helpers

const ignoreSegs = ["auth", "topic", "user"];

const crumbMap: Record<string, string> = {
  "dang-nhap": "Đăng nhập",
  "dang-ky": "Đăng ký",
  "huong-dan": "Hướng dẫn",
  "trac-nghiem-tinh-cach": "Trắc nghiệm tính cách",
  "tinh-diem": "Tính điểm",
  "tk-nganh-truong": "TK Ngành-Trường",
  "ptn-phuong-thuc": "PTN Phương thức",
  "ptn-quy-doi-diem": "PTN Quy đổi điểm",
  "ptn-pho-diem": "PTN Phổ điểm",
  "ptn-diem-chuan": "PTN Điểm chuẩn",
};

function getCrumbName(crumb: string) {
  return crumbMap[crumb] ?? crumb;
}

// Types

export type Crumb = {
  name: string;
  pathname: string;
};

type BreadcrumbContextType = {
  crumbs: Crumb[];
  setBreadcrumb: (pathname: string) => void;
};

// Context

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  crumbs: [],
  setBreadcrumb: () => {},
});

export const useBreadcrumb = () => useContext(BreadcrumbContext);

// Provider

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  // Crumb init
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  // Origin init
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Update breadcrump (using by page)
  function setBreadcrumb(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);

    const newCrumbs: Crumb[] = [];

    // Root crumb
    newCrumbs.push({
      name: "Trang chủ",
      pathname: "/",
    });

    let currPathname = "";

    segments.forEach((seg) => {
      currPathname += "/" + seg;
      if (!ignoreSegs.includes(seg))
        newCrumbs.push({
          name: getCrumbName(seg),
          pathname: currPathname,
        });
    });

    setCrumbs(newCrumbs);
  }

  // JSON-LD cho SEO

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${origin}${crumb.pathname}`,
    })),
  };

  return (
    <BreadcrumbContext.Provider value={{ crumbs, setBreadcrumb }}>
      {children}

      {crumbs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </BreadcrumbContext.Provider>
  );
}
