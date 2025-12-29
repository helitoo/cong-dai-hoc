import Image from "next/image";

import Quote from "@/components/quote";

function FeatureSection({
  sectionSeq = "",
  title,
  content,
  image,
  reverse,
}: {
  sectionSeq?: string;
  title: string;
  content: string;
  image: string;
  reverse?: boolean;
}) {
  return (
    <section className="container mx-auto px-6 fade-up">
      <div
        className={`flex flex-col items-center gap-10 ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        {/* Text */}
        <div className="w-full lg:w-1/2 text-justify">
          <div className="flex flex-col">
            {sectionSeq ? (
              <h2 className="bg-sky-400/50 border-2 border-dashed border-sky-500 w-fit px-5 py-1 text-white font-semibold">
                {sectionSeq}
              </h2>
            ) : (
              <></>
            )}
            <h3 className="text-[28px] md:text-[36px] xl:text-[44px] font-montserrat font-bold text-sky-500">
              {title}
            </h3>
          </div>

          <div className="mt-4 mb-6 h-1 w-30 bg-sky-500 rounded" />

          <p className="text-[18px] md:text-[20px] leading-relaxed">
            {content}
          </p>
        </div>

        {/* Image */}
        <div className="w-full lg:w-1/2 flex justify-center transition-all duration-150 hover:-translate-y-1">
          <div className="relative inline-block">
            {/* Shadow */}
            <div
              className="
        absolute inset-0
        translate-x-3 translate-y-3
        bg-sky-400/50
        border-2 border-dashed border-sky-500
        rounded-xl
        z-0
      "
            />

            {/* Image */}
            <Image
              src={image}
              alt={title}
              width={480}
              height={360}
              className="
        relative
        w-auto h-auto max-w-full
        rounded-xl
        bg-white
        border-2 border-sky-500
      "
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen space-y-20">
      {/* ================= HERO / SECTION 1 ================= */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center py-10">
          <Image
            src="/images/logo.png"
            alt="Cổng đại học"
            width={120}
            height={120}
            draggable={false}
            className="mb-8 transition-all duration-150 hover:-translate-y-1"
          />

          <h1 className="text-[32px] leading-9.5 md:text-[42px] md:leading-12.5 xl:text-[56px] xl:leading-16.5 text-sky-500 font-montserrat font-bold">
            Cổng đại học
          </h1>

          <div className="mt-4 mb-6 h-1 w-35 bg-sky-500 rounded" />

          <p className="max-w-3xl text-[18px] md:text-[20px] leading-relaxed text-center">
            Bộ công cụ hỗ trợ tuyển sinh toàn vẹn - giúp bạn hiểu rõ bản thân,
            tính toán điểm số và lựa chọn ngành học, trường học phù hợp nhất.
          </p>
        </div>
      </section>

      {/* ================= SECTION 2 ================= */}
      <FeatureSection
        sectionSeq="Bước 1"
        title="Tính điểm xét tuyển"
        content="Vào trang Tính điểm, nhập điểm số của bản thân. Cổng sẽ tự động tính toán điểm xét tuyển cho tất cả các phương thức hiện hành, bao gồm tự suy luận điểm Học bạ và THPT dựa trên dữ liệu của Bộ, giúp bạn có cái nhìn toàn diện về khả năng bản thân hiện tại."
        image="/huong-dan/tinh-diem.png"
        reverse={false}
      />

      {/* ================= SECTION 3 ================= */}
      <FeatureSection
        sectionSeq="Bước 2"
        title="Trắc nghiệm tính cách Holland"
        content="Kết quả giúp bạn xác định nhóm tính cách nghề nghiệp nổi trội và gợi ý các nhóm ngành phù hợp nhất với bản thân."
        image="/huong-dan/hld.png"
        reverse
      />

      {/* ================= SECTION 4 ================= */}
      <FeatureSection
        sectionSeq="Bước 3"
        title={`Tìm Ngành - Trường`}
        content="Dựa trên kết quả học tập & tính cách, Cổng sẽ đề xuất các ngành học và trường Đại học phù hợp nhất, giúp bạn đưa ra quyết định chính xác và tự tin hơn."
        image="/huong-dan/tk-nganh-truong.png"
        reverse={false}
      />

      {/* ================= SECTION 5 ================= */}
      <FeatureSection
        title="Labs!"
        content="Khám phá sâu hơn kho dữ liệu tuyển sinh khổng lồ thông qua các phòng thí nghiệm của Cổng - nơi bạn có thể phân tích & so sánh nhiều góc nhìn khác nhau."
        image="/huong-dan/labs.png"
        reverse
      />

      {/* ================= SECTION 6 ================= */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[28px] md:text-[36px] xl:text-[44px] font-montserrat font-bold text-sky-500">
            Hãy tự khám phá phần còn lại!
          </h2>

          <div className="mt-4 mb-6 h-1 w-30 bg-sky-500 rounded" />

          <p className="max-w-2xl text-[18px] md:text-[20px]">
            Cổng không chỉ là một trang web đơn thuần - đó là một tấm bản đồ
            sống vạch ra con đường hướng bạn đến Đại học nhanh - đúng nhất có
            thể!
          </p>
        </div>
      </section>

      {/*  */}
      <div className="px-10">
        <Quote type="warning">
          <ul className="list-disc space-y-2">
            <li className="ml-5">
              Dữ liệu của trang web có độ chính xác cao nhưng{" "}
              <strong>
                không phải là nguồn dữ liệu chính thức của Nhà nước
              </strong>
              . Bạn có thể kiểm tra dataset của trang web tại repository hoặc
              Kaggle.
            </li>
            <li className="ml-5">
              Sau khi sử dụng trang web,{" "}
              <strong>nên tra cứu lại thông tin từ các nguồn chính thức</strong>{" "}
              để đảm bảo độ chính xác.
            </li>
          </ul>
        </Quote>
      </div>

      <Image
        src={"/huong-dan/bku.png"}
        alt={"Bản đồ BKU"}
        width={480}
        height={360}
        className="w-auto h-auto max-w-full mx-auto transition-all duration-150 hover:-translate-y-1 filter drop-shadow-[0_1px_2px_rgba(8,47,73,0.25)]"
        draggable={false}
      />
    </main>
  );
}
