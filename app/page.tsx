import { Quote } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="background-box flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-2">
        <Image
          src={"/images/logo.png"}
          width={50}
          height={50}
          alt={"Logo"}
          draggable={false}
          className="w-fit"
        ></Image>
        <div className="w-fit md:p-10 p-5 text-center font-semibold text-3xl md:text-6xl text-sky-500 font-montserrat">
          Cổng Đại học
        </div>
      </div>

      <div className="relative w-fit mx-auto flex items-center p-10 justify-center overflow-hidden text-sky-800">
        <Quote className="absolute top-4 left-4 h-6 w-6" />
        <p className="text-lg font-medium text-center text-sky-800">
          Khám phá thế giới Đại học rộng mở
        </p>
      </div>
    </div>
  );
}
