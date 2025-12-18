"use client";

import { CirclePlus } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Select
          value={distQuery.examId}
          onValueChange={(v) =>
            setDistQuery({ ...distQuery, examId: v as ExamId })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn kỳ thi..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="thpt">Tốt nghiệp THPT</SelectItem>
              <SelectItem value="dgtd">ĐGTD HUST (TSA)</SelectItem>
              <SelectItem value="dghn">ĐGNL ĐHQG-HN (HSA)</SelectItem>
              <SelectItem value="dgsg">ĐGNL ĐHQG-HCM (V-ACT)</SelectItem>
              <SelectItem value="dgcb">ĐGNLCB HCMUE (H-SCA)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label className="ml-1">Môn thi</Label>
        <Select
          value={distQuery.subjectId}
          onValueChange={(v) =>
            setDistQuery({ ...distQuery, subjectId: v as SubjectId })
          }
          disabled={
            String(distQuery.examId) != "thpt" &&
            String(distQuery.examId) != "dgcb"
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn môn học..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="to">Toán</SelectItem>
              <SelectItem value="vl">Lý</SelectItem>
              <SelectItem value="hh">Hóa</SelectItem>
              <SelectItem value="sh">Sinh</SelectItem>
              <SelectItem value="th">Tin</SelectItem>
              <SelectItem value="an">Anh</SelectItem>
              <SelectItem value="nv">Văn</SelectItem>
              <SelectItem value="ls">Sử</SelectItem>
              <SelectItem value="dl">Địa</SelectItem>
              <SelectItem value="gd">GDKT-PL</SelectItem>
              <SelectItem value="c1">CNCN</SelectItem>
              <SelectItem value="c2">CNNN</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label className="ml-1">Năm thi</Label>
        <Select
          value={distQuery.year.toString()}
          onValueChange={(v) => setDistQuery({ ...distQuery, year: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn năm..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onClickHandler} variant="ghost" size="icon">
        <CirclePlus className="button-icon text-green-500" />
      </Button>
    </div>
  );
}
