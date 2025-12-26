import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

type SocialNode = {
  url: string;
  icon: ReactNode;
  label: string;
};

const contactInfo: SocialNode[] = [
  {
    url: "https://www.facebook.com/bminh.tb",
    icon: (
      <svg viewBox="0 0 128 128" className="size-5">
        <path
          fill="#ffffff"
          d="M116.42 5.07H11.58a6.5 6.5 0 00-6.5 6.5v104.85a6.5 6.5 0 006.5 6.5H68V77.29H52.66V59.5H68V46.38c0-15.22 9.3-23.51 22.88-23.51a126 126 0 0113.72.7v15.91h-9.39c-7.39 0-8.82 3.51-8.82 8.66V59.5H104l-2.29 17.79H86.39v45.64h30a6.51 6.51 0 006.5-6.5V11.58a6.5 6.5 0 00-6.47-6.51z"
        ></path>
      </svg>
    ),
    label: "Bảo",
  },
  {
    url: "mailto:bao162006@gmail.com",
    icon: (
      <svg viewBox="0 0 128 128" className="size-5">
        <path
          fill="#ffffff"
          d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"
        ></path>
      </svg>
    ),
    label: "bao162006@gmail.com",
  },
];

const repoInfo: SocialNode[] = [
  {
    url: "https://github.com/helitoo/cong-dai-hoc",
    icon: (
      <svg viewBox="0 0 128 128" className="size-5">
        <g fill="#ffffff">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
          ></path>
          <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path>
        </g>
      </svg>
    ),
    label: "cong-dai-hoc",
  },
  {
    url: "https://www.kaggle.com/datasets/baoctt/vietnam-university-admission-cut-off-scores/data",
    icon: (
      <svg viewBox="0 0 128 128" className="size-5">
        <path
          fill="#ffffff"
          d="M100.402 127.243c-.126.501-.627.752-1.502.752H82.168c-1.007 0-1.876-.438-2.632-1.317L51.91 91.531l-7.706 7.33v27.258c0 1.255-.628 1.881-1.88 1.881h-12.97c-1.254 0-1.88-.626-1.88-1.88V1.876c0-1.25.625-1.877 1.88-1.877h12.97c1.253 0 1.882.628 1.882 1.876v76.501l33.08-33.457c.878-.875 1.755-1.315 2.631-1.315h17.295c.75 0 1.25.315 1.504.937.252.753.19 1.316-.19 1.693L63.561 80.062l36.465 45.3c.499.502.625 1.128.38 1.881"
        ></path>
      </svg>
    ),
    label: "vietnam-university-admission-cut-off-scores",
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-linear-to-r from-cyan-400 to-blue-500 py-2 mt-10 border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Logo + tên website */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold font-montserrat text-white">
            Cổng Đại học
          </h3>
          <p className="text-sm text-white font-semibold">
            Thông tin đã cập nhật đến năm 2025
          </p>
        </div>

        {/* Social icons */}
        <div className="flex gap-3 my-4 md:my-0  p-2 md:p-0">
          <div className="flex flex-row md:flex-col gap-2">
            {contactInfo.map((contactNode, index) => (
              <Link
                key={index}
                href={contactNode.url}
                target="_blank"
                className="flex gap-4 md:gap-2 items-center button text-white"
              >
                {contactNode.icon}
                <span className="text-sm truncate hidden md:block">
                  {contactNode.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex flex-row md:flex-col gap-2">
            {repoInfo.map((contactNode, index) => (
              <Link
                key={index}
                href={contactNode.url}
                target="_blank"
                className="flex gap-4 md:gap-2 items-center button text-white"
              >
                {contactNode.icon}
                <span className="text-sm truncate hidden md:block">
                  {contactNode.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
