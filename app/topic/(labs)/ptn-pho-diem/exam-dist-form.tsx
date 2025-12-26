"use client";

import { CirclePlus } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import showToast from "@/components/toastify-wrapper";

import type { SubjectId } from "@/lib/universities/convertors/subjects";

import {
  getDist,
  type Dist,
} from "@/lib/universities/convertors/exam-distributions";

import { getMethodName } from "@/lib/universities/convertors/method";

import { getSubjectName } from "@/lib/universities/convertors/subjects";

type ExamId = "thpt" | "dgtd" | "dghn" | "dgsg" | "dgcb";

type ExamDistQuery = {
  examId: ExamId;
  subjectId: SubjectId;
  year: string;
};

export default function ExamDistForm({
  addDist,
}: {
  addDist: (dist: Dist, label: string) => void;
}) {
  const [distQuery, setDistQuery] = useState<ExamDistQuery>({
    examId: "thpt",
    subjectId: "to",
    year: "2025",
  });

  function onClickHandler() {
    if (!distQuery.examId || !distQuery.subjectId || !distQuery.year) {
      showToast({ type: "warn", message: "Chưa nhập đủ dữ liệu" });
      return;
    }

    const dist = getDist(
      distQuery.examId,
      distQuery.examId !== "thpt" && distQuery.examId !== "dgcb"
        ? "al"
        : distQuery.subjectId,
      distQuery.year
    );

    if (!dist) {
      showToast({ type: "warn", message: "Không tìm thấy phổ điểm!" });
      return;
    }

    addDist(
      dist,
      `${getMethodName(distQuery.examId)} ${getSubjectName(
        distQuery.subjectId
      )} ${distQuery.year.slice(2)}`
    );
  }

  return (
    <div className="flex items-center justify-evenly gap-2 p-2 shadow">
      <div className="flex flex-col gap-1 w-full">
        <Label className="ml-1">Kỳ thi</Label>

        <NativeSelect
          className="w-full"
          value={distQuery.examId}
          onChange={(e) =>
            setDistQuery({ ...distQuery, examId: e.target.value as ExamId })
          }
        >
          <NativeSelectOption value="thpt">Tốt nghiệp THPT</NativeSelectOption>
          <NativeSelectOption value="dgtd">ĐGTD HUST (TSA)</NativeSelectOption>
          <NativeSelectOption value="dghn">
            ĐGNL ĐHQG-HN (HSA)
          </NativeSelectOption>
          <NativeSelectOption value="dgsg">
            ĐGNL ĐHQG-HCM (V-ACT)
          </NativeSelectOption>
          <NativeSelectOption value="dgcb">
            ĐGNLCB HCMUE (H-SCA)
          </NativeSelectOption>
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1 w-full ">
        <Label className="ml-1">Môn thi</Label>

        <NativeSelect
          className="w-full"
          value={distQuery.subjectId}
          onChange={(e) =>
            setDistQuery({ ...distQuery, subjectId: e.target.value })
          }
        >
          <NativeSelectOption value="to">Toán</NativeSelectOption>
          <NativeSelectOption value="vl">Lý</NativeSelectOption>
          <NativeSelectOption value="hh">Hóa</NativeSelectOption>
          <NativeSelectOption value="sh">Sinh</NativeSelectOption>
          <NativeSelectOption value="th">Tin</NativeSelectOption>
          <NativeSelectOption value="an">Anh</NativeSelectOption>
          <NativeSelectOption value="nv">Văn</NativeSelectOption>
          <NativeSelectOption value="ls">Sử</NativeSelectOption>
          <NativeSelectOption value="dl">Địa</NativeSelectOption>
          <NativeSelectOption value="gd">GDKT-PL</NativeSelectOption>
          <NativeSelectOption value="c1">CNCN</NativeSelectOption>
          <NativeSelectOption value="c2">CNNN</NativeSelectOption>
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label className="ml-1">Năm thi</Label>

        <NativeSelect
          className="w-full"
          value={distQuery.year.toString()}
          onChange={(e) => setDistQuery({ ...distQuery, year: e.target.value })}
        >
          <NativeSelectOption value="2025">2025</NativeSelectOption>
          <NativeSelectOption value="2024">2024</NativeSelectOption>
          <NativeSelectOption value="2023">2023</NativeSelectOption>
        </NativeSelect>
      </div>

      <Button onClick={onClickHandler} variant="ghost" size="icon">
        <CirclePlus className="button-icon text-green-500" />
      </Button>
    </div>
  );
}
