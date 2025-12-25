// "use client";

import Link from "next/link";

import { ReactNode } from "react";

import {
  ArrowRightLeft,
  Backpack,
  BookMarked,
  Calculator,
  ChartArea,
  Database,
  DoorOpen,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Monitor,
  MonitorCog,
  Notebook,
  PencilRuler,
  Rainbow,
  Search,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type node = {
  icon: ReactNode;
  linkElm: ReactNode;
  // isPrivate?: boolean;
};

type collapsibleItem = {
  trigger: node;
  content: node[];
};

type sidebarType = (node | collapsibleItem)[] | [];

const sidebarItems: sidebarType = [
  {
    icon: <BookMarked />,
    linkElm: <Link href="/topic/huong-dan">Hướng dẫn</Link>,
  },
  {
    trigger: {
      icon: <PencilRuler />,
      linkElm: <>Tính toán</>,
    },
    content: [
      {
        icon: <Calculator />,
        linkElm: <Link href="/topic/tinh-diem">Tính Điểm</Link>,
      },
      {
        icon: <Rainbow />,
        linkElm: (
          <Link href="/topic/trac-nghiem-tinh-cach">Trắc nghiệm tính cách</Link>
        ),
      },
      {
        icon: <Search />,
        linkElm: <Link href="/topic/tk-nganh-truong">Tìm kiếm Ngành</Link>,
      },
    ],
  },
  {
    trigger: {
      icon: <FlaskConical />,
      linkElm: <>Phòng thí nghiệm</>,
    },
    content: [
      {
        icon: <DoorOpen />,
        linkElm: <Link href="/topic/ptn-phuong-thuc">Phương thức</Link>,
      },
      {
        icon: <ArrowRightLeft />,
        linkElm: <Link href="/topic/ptn-quy-doi-diem">Quy đổi điểm</Link>,
      },
      {
        icon: <ChartArea />,
        linkElm: <Link href="/topic/ptn-pho-diem">Phổ điểm</Link>,
      },
      {
        icon: <Database />,
        linkElm: <Link href="/topic/ptn-diem-chuan">Điểm chuẩn</Link>,
      },
    ],
  },
  {
    trigger: {
      icon: <Notebook />,
      linkElm: <>Chủ đề</>,
    },
    content: [
      {
        icon: <MonitorCog />,
        linkElm: <Link href="/topic/he-thong">Hệ thống</Link>,
      },
      {
        icon: <GraduationCap />,
        linkElm: <Link href="/topic/tin-ts">Tin tuyển sinh</Link>,
      },
      {
        icon: <Backpack />,
        linkElm: <Link href="/topic/tin-sv">Tin sinh viên</Link>,
      },
      {
        icon: <Lightbulb />,
        linkElm: <Link href="/topic/kien-thuc">Kiến thức</Link>,
      },
    ],
  },
];

export default function AppSidebar() {
  // const isAuthed = useAuthStore((state) => state.isAuthed());

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0! my-0! py-0!">
              {sidebarItems.map((item, index) => {
                // If is collapsibleItem
                if ("trigger" in item) {
                  // if (item.trigger.isPrivate && !isAuthed) return null;

                  const filteredContent = item.content.filter((subItem) => {
                    // if (subItem.isPrivate) return isAuthed;
                    return true;
                  });

                  if (!item.trigger && filteredContent.length === 0)
                    return null;

                  return (
                    <Collapsible
                      key={index}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            {item.trigger.icon}
                            {item.trigger.linkElm}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        {filteredContent.length > 0 && (
                          <CollapsibleContent>
                            <SidebarMenuSub className="gap-0! my-0! py-0!">
                              {filteredContent.map((subItem, subIndex) => (
                                <SidebarMenuSubItem key={subIndex}>
                                  <SidebarMenuButton>
                                    {subItem.icon}
                                    {subItem.linkElm}
                                  </SidebarMenuButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Else

                // if (item.isPrivate && !isAuthed) return null;

                return (
                  <SidebarMenuItem key={index} className="mt-1!">
                    <SidebarMenuButton>
                      {item.icon}
                      {item.linkElm}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
