import { Facebook, Github, Mail } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type ContactNode = {
  url: string;
  icon: ReactNode;
  label: string;
};

const contactInfo: ContactNode[] = [
  {
    url: "https://www.facebook.com/bminh.tb",
    icon: <Facebook className="size-5" />,
    label: "Bảo",
  },
  {
    url: "mailto:bao162006@gmail.com",
    icon: <Mail className="size-5" />,
    label: "bao162006@gmail.com",
  },
  {
    url: "https://github.com/helitoo/universities.git",
    icon: <Github className="size-5" />,
    label: "cong-dai-hoc",
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-linear-to-r from-cyan-400 to-blue-500 py-2 mt-10 border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Logo + tên website */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold font-montserrat text-white">
            Cổng Đại học
          </h3>
          <p className="text-sm text-white">
            © Bảo • Thông tin đã cập nhật đến năm 2025
          </p>
        </div>

        {/* Social icons */}
        <div className="flex gap-4 mt-4 md:mt-0">
          {contactInfo.map((contactNode, index) => (
            <Link
              key={index}
              href={contactNode.url}
              target="_blank"
              className="flex gap-2 items-center button text-blue-800"
            >
              {contactNode.icon}
              <span className="text-sm truncate">{contactNode.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
