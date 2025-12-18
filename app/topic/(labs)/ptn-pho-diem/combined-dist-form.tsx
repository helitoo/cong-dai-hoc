"use client";

import { CirclePlus } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import {
  SubjectGroupId,
  getSubjectsFromGroup,
} from "@/lib/universities/convertors/subject-groups";

import {
  getCombinedDist,
  getDist,
  type Dist,
} from "@/lib/universities/convertors/exam-distributions";
import { getExactSubjectGroupFromName } from "@/lib/universities/convertors/subject-groups";

import { getMethodName } from "@/lib/universities/convertors/method";

type ExamId = "thpt" | "dgcb";

type CombinedDistQuery = {
  examId: ExamId;
  subjectGroupId: SubjectGroupId;
  year: string;
};

export default function CombinedDistForm({
  addDist,
}: {
  addDist: (dist: Dist, label: string) => void;
}) {
  const [distQuery, setDistQuery] = useState<CombinedDistQuery>({
    examId: "thpt",
    subjectGroupId: "G001",
    year: "2025",
  });

  const [subjectGroupName, setSubjectGroupName] = useState<string>("");

  function subjectGroupValidator() {
    const exactSubjectGroup = getExactSubjectGroupFromName(
      subjectGroupName.trim().replace(/\s+/g, "-").replace(/-+/g, "-")
    );

    setDistQuery({
      ...distQuery,
      subjectGroupId: exactSubjectGroup.id as SubjectGroupId,
    });
    setSubjectGroupName(exactSubjectGroup.name);
  }

  function onClickHandler() {
    if (!distQuery.examId || !distQuery.subjectGroupId || !distQuery.year) {
      showToast({ type: "warn", message: "Chưa nhập đủ dữ liệu!" });
      return;
    }

    const majorDists = getSubjectsFromGroup(distQuery.subjectGroupId).map(
      (subjId) => getDist(distQuery.examId, subjId, distQuery.year)
    );

    if (majorDists.some((v) => !v)) {
      showToast({ type: "warn", message: "Không tìm thấy phổ điểm!" });
      return;
    }

    const dist = getCombinedDist(majorDists as Dist[]);

    if (!dist) {
      showToast({ type: "warn", message: "Không tìm thấy phổ điểm!" });
      return;
    }

    addDist(
      dist,
      `${getMethodName(
        distQuery.examId
      )} ${subjectGroupName} ${distQuery.year.slice(2)}`
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
            <SelectValue placeholder="Chọn phương thức..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="thpt">Tốt nghiệp THPT</SelectItem>
              <SelectItem value="dgcb">ĐGNLCB HCMUE (H-SCA)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Label className="ml-1">Các môn trong tổ hợp</Label>
        <Input
          placeholder="Toán-Lý-Hóa..."
          value={subjectGroupName}
          onChange={(e) => setSubjectGroupName(e.target.value)}
          onBlur={subjectGroupValidator}
        ></Input>
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
