"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Kbd } from "@/components/ui/kbd";

import Quote from "@/components/quote";

import AchievementsForm from "@/app/topic/(tools)/tinh-diem/form-components/achievements-info";
import AppliedSubjects from "@/app/topic/(tools)/tinh-diem/form-components/applied-subjects";
import CertificationsForm from "@/app/topic/(tools)/tinh-diem/form-components/certifications-info";
import OutsideExamScoresForm from "@/app/topic/(tools)/tinh-diem/form-components/outside-exam-scores";
import PriorityForm from "@/app/topic/(tools)/tinh-diem/form-components/priority-info";
import ThhbForm from "@/app/topic/(tools)/tinh-diem/form-components/thhb-form";
import ThptForm from "@/app/topic/(tools)/tinh-diem/form-components/thpt-form";

import {
  allAvailableSubjects,
  scoreSchema,
  type ScoreData,
} from "@/lib/universities/calculators/score-data/score-schema";

import ScoreDataManager from "@/app/topic/(tools)/tinh-diem/score-data-magager";
import ScoreRes from "@/app/topic/(tools)/tinh-diem/score-res";

export const DEFAULT_SCORE_FORM_VALUES = {
  appliedSubjects: ["to", "nv", "an", "ls"],
  thhb: Object.fromEntries(
    allAvailableSubjects.map((subject) => [subject, [0, 0, 0, 0, 0, 0]])
  ),
  thpt: Object.fromEntries(allAvailableSubjects.map((subject) => [subject, 0])),

  dgtd: 0,
  dghn: 0,

  dgsg: {
    to: 0,
    nv: 0,
    an: 0,
    kh: 0,
  },

  dgsp: Object.fromEntries(allAvailableSubjects.map((subject) => [subject, 0])),

  dgcb: {
    to: 0,
    vl: 0,
    hh: 0,
    sh: 0,
    nv: 0,
    an: 0,
  },

  vsat: {
    to: 0,
    vl: 0,
    hh: 0,
    sh: 0,
    nv: 0,
    an: 0,
    ls: 0,
    dl: 0,
  },

  dgca: {
    vl: 0,
    hh: 0,
    sh: 0,
    dl: 0,
  },

  priority: {
    dt: 0,
    kv: 0,
  },

  achievements: [],
  certifications: [],
};

export default function Page() {
  // Form init

  const form = useForm<ScoreData>({
    resolver: zodResolver(scoreSchema),
    defaultValues: DEFAULT_SCORE_FORM_VALUES as any,
  });

  const appliedSubjects = form.watch("appliedSubjects");

  // Main component
  return (
    <div className="background-box flex flex-col">
      <div className="box w-full h-fit">
        <h1 className="box-title w-full">Tính điểm</h1>

        <Accordion
          type="multiple"
          className="bg-background"
          defaultValue={["item-1", "item-2", "item-3", "item-4"]}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Đọc trước khi điền dữ liệu</AccordionTrigger>
            <AccordionContent className="pl-5 pt-5 space-y-3">
              <Quote type="tip">
                <ul className="list-disc space-y-3">
                  <li className="ml-5">
                    <strong>
                      Chỉ cần nhập dữ liệu vào những ô mà bạn muốn
                    </strong>
                    , không cần nhập toàn bộ các ô dưới đây.
                  </li>
                  <li className="ml-5">
                    Trang web có thể{" "}
                    <strong>dự đoán điểm TN THPT / lớp 12 / 11</strong> dựa trên
                    điểm các lớp dưới. Nếu bạn là học sinh lớp dưới (chưa học
                    lớp 11, 12 hoặc chưa thi TN THPT), chỉ cần điền số điểm các
                    lớp trước vào, trang web sẽ dự đoán điểm các ô chưa điền
                    (phù hợp cho những ai có định hướng sớm).
                  </li>
                  <li className="ml-5">
                    Trang web có thể <strong>tự sữa lỗi nhập liệu</strong>. VD,
                    trong ô nhập điểm học bạ, nhập 95 → tự sửa thành 9,5.
                  </li>
                  <li className="ml-5">
                    Sử dụng{" "}
                    <strong>
                      phím <Kbd>Tab</Kbd> để di chuyển nhanh
                    </strong>{" "}
                    trong bảng dữ liệu.
                  </li>
                  <li className="ml-5">
                    <strong>Chỉ nhập điểm thô</strong>, không nhập điểm sau khi
                    cộng điểm khuyến khích và ưu tiên (điểm xét tuyển).
                  </li>
                </ul>
              </Quote>

              <Quote type="warning">
                Kết quả tính toán của trang web chỉ có tính tham khảo chung,
                thuật toán được thiết kế sao cho đúng với nhiều trường nhất có
                thể.
              </Quote>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Thông tin môn học</AccordionTrigger>
            <AccordionContent className="pl-5 pt-5">
              <AppliedSubjects control={form.control} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Điểm Học bạ THPT</AccordionTrigger>
            <AccordionContent className="pl-5 pt-5">
              <ThhbForm
                control={form.control}
                appliedSubjects={appliedSubjects}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Điểm Tốt nghiệp THPT</AccordionTrigger>
            <AccordionContent className="pl-5 pt-5">
              <ThptForm
                control={form.control}
                appliedSubjects={appliedSubjects}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Điểm Các kỳ thi riêng</AccordionTrigger>
            <AccordionContent className="pl-5 pt-5">
              <OutsideExamScoresForm
                control={form.control}
                appliedSubjects={appliedSubjects}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>Thông tin ưu tiên</AccordionTrigger>
            <AccordionContent className="pl-5 pt-5">
              <PriorityForm control={form.control} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>Thành tích cá nhân</AccordionTrigger>
            <AccordionContent className="pl-5 pt-5">
              <AchievementsForm control={form.control} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger>Chứng chỉ quốc tế</AccordionTrigger>
            <AccordionContent className="pl-5 pt-5">
              <CertificationsForm
                control={form.control}
                setValue={form.setValue}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <ScoreDataManager form={form} />

        <ScoreRes form={form} />
      </div>
    </div>
  );
}
