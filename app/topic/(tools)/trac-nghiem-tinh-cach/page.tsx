import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import HldForm from "@/app/topic/(tools)/trac-nghiem-tinh-cach/hld-form";

export default function Page() {
  return (
    <div className="background-box flex flex-col">
      <div className="box w-full h-fit">
        <h1 className="box-title w-full">Trắc nghiệm tính cách</h1>

        <Accordion
          type="single"
          className="bg-background"
          defaultValue="item-1"
          collapsible
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Giới thiệu</AccordionTrigger>
            <AccordionContent>
              <p>
                Bài test dựa trên lý thuyết <strong>"Holland codes"</strong>.
                Theo tiến sĩ Tâm lý học <em>John L.Holland (1919 - 2008)</em>,
                con người được chia ra thành 6 loại cá tính (
                <em>RIASEC - Holland codes</em>). Mỗi loại cá tính sẽ phù hợp
                với một số lĩnh vực nghề nghiệp. Cụ thể như sau:
              </p>
              <Image
                src={"/holland.png"}
                width={1000}
                height={600}
                sizes="100vw"
                alt="Các nhóm tính cách theo lý thuyết Holland"
                draggable={false}
                className="w-full mx-auto"
              ></Image>
              <p>
                Cho đến hiện đại, Holland codes vẫn là bộ công cụ phổ biến được
                dùng để khảo sát tính cách và hướng nghiệp trên thế giới và được
                tin dùng bởi nhiều cơ sở giáo dục.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Hướng dẫn</AccordionTrigger>
            <AccordionContent>
              <p>
                Bài test tính cách của <em>Cổng Đại học</em> được xây dựng dựa
                trên lý thuyết Holland với <strong>5 câu hỏi</strong>. Mỗi câu
                hỏi gồm 1 tình huống thực tế và 6 nhận định khác nhau.
              </p>
              <p>
                Thí sinh đánh giá mỗi nhận định theo 3 mốc:{" "}
                <strong>Sai, Không đúng - Không sai, Đúng</strong>.
              </p>
              <p>
                Thí sinh không cần đăng nhập để làm bài. Không có thời gian làm
                bài và giới hạn gì khác.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Làm bài</AccordionTrigger>
            <AccordionContent>
              <HldForm />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
