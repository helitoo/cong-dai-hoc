"use client";

import { FocusEvent } from "react";

import {
  ArrowRightFromLine,
  ArrowRightLeft,
  ArrowRightToLine,
} from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import showToast from "@/components/toastify-wrapper";

import { scoreValidator } from "@/lib/universities/calculators/score-data/score-schema";

import {
  getExactSubjectGroupFromName,
  getSubjectsFromGroup,
  type SubjectGroupId,
} from "@/lib/universities/convertors/subject-groups";

import {
  getCombinedDist,
  getDist,
  type Dist,
} from "@/lib/universities/convertors/exam-distributions";

import {
  getConvertedScore,
  round2,
} from "@/lib/universities/convertors/score-convertor";

type MethodId = "thpt" | "dgtd" | "dghn" | "dgsg";

export default function ScoreConvertForm() {
  const [resMethodId, setResMethodId] = useState<MethodId>("thpt");
  const [destMethodId, setDestMethodId] = useState<MethodId>("thpt");

  const [resYear, setResYear] = useState<string>("2025");
  const [destYear, setDestYear] = useState<string>("2025");

  const [resSubjectGroupId, setResSubjectGroupId] =
    useState<SubjectGroupId>("G001");
  const [destSubjectGroupId, setDestSubjectGroupId] =
    useState<SubjectGroupId>("G001");
  const [resSubjectGroupName, setResSubjectGroupName] =
    useState<string>("Toán-Lý-Hóa");
  const [destSubjectGroupName, setDestSubjectGroupName] =
    useState<string>("Toán-Lý-Hóa");

  const [resScore, setResScore] = useState<string>("");
  const [destScore, setDestScore] = useState<string>("--");
  const [destPer, setDestPer] = useState<string>("--");

  // Score validator

  function resScoreValidator(
    methodId: MethodId,
    event: FocusEvent<HTMLInputElement>
  ) {
    switch (methodId) {
      case "thpt":
        event.target.value = scoreValidator(
          event.target.value,
          0,
          30,
          false
        ).toString();
        return;
      case "dghn":
        event.target.value = scoreValidator(
          event.target.value,
          0,
          150,
          false
        ).toString();
        return;
      case "dgsg":
        event.target.value = scoreValidator(
          event.target.value,
          0,
          1200,
          true
        ).toString();
        return;
      case "dgtd":
        event.target.value = scoreValidator(
          event.target.value,
          0,
          100,
          false
        ).toString();
        return;
    }
  }

  // Subject group validator

  function subjectGroupValidator(type: "res" | "dest") {
    const [subjectGroupName, setSubjectGroupName, setSubjectGroupId] =
      type === "res"
        ? [
            String(resSubjectGroupName),
            setResSubjectGroupName,
            setResSubjectGroupId,
          ]
        : [
            String(destSubjectGroupName),
            setDestSubjectGroupName,
            setDestSubjectGroupId,
          ];

    const exactSubjectGroup = getExactSubjectGroupFromName(
      subjectGroupName.trim().replace(/\s+/g, "-").replace(/-+/g, "-")
    );

    setSubjectGroupId(exactSubjectGroup.id as SubjectGroupId);
    setSubjectGroupName(exactSubjectGroup.name);
  }

  // Score convert
  function convertScore() {
    // Verify

    if (resMethodId === "thpt" && !resSubjectGroupId) {
      showToast({
        type: "error",
        message: "Chưa nhập tổ hợp môn cho điểm đầu!",
      });
      return;
    }

    if (destMethodId === "thpt" && !destSubjectGroupId) {
      showToast({
        type: "error",
        message: "Chưa nhập tổ hợp môn cho điểm đích!",
      });
      return;
    }

    if (!resScore) {
      showToast({
        type: "error",
        message: "Chưa nhập điểm!",
      });
      return;
    }

    // Main processing

    function getCurrDist(
      methodId: MethodId,
      subjectGroupId: SubjectGroupId,
      year: string
    ): Dist {
      const base =
        methodId === "thpt"
          ? 10
          : methodId === "dghn"
          ? 150
          : methodId === "dgsg"
          ? 1200
          : 100;

      const defaultDist: Dist = {
        freq: [0, 1, 6, 0],
        base,
        min: 0,
        max: base,
      };

      if (methodId === "thpt")
        return (
          getCombinedDist(
            getSubjectsFromGroup(subjectGroupId).map(
              (subjId) => getDist("thpt", subjId, year)!
            )
          ) ?? defaultDist
        );
      else return getDist(methodId, "al", year) ?? defaultDist;
    }

    const res = getConvertedScore(
      Number(resScore),
      getCurrDist(resMethodId, resSubjectGroupId!, resYear),
      getCurrDist(destMethodId, destSubjectGroupId!, destYear)
    );

    setDestScore(round2(res.score).toString());
    setDestPer(`${round2(res.percentile * 100).toString()}%`);
  }

  // Component
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
        <div className="rounded-lg shadow-md p-2 space-y-4">
          <h2 className="text-xl mb-5 font-semibold flex items-center gap-2">
            Chọn điểm đầu <ArrowRightFromLine className="button-icon" />
          </h2>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-2/3">
              <Label className="ml-1">Kỳ thi</Label>

              <NativeSelect
                className="w-full"
                value={resMethodId}
                onChange={(e) => {
                  setResMethodId(e.target.value as MethodId);
                  setResScore("");
                }}
              >
                <NativeSelectOption value="thpt">
                  Tốt nghiệp THPT
                </NativeSelectOption>
                <NativeSelectOption value="dgtd">
                  ĐGTD HUST (TSA)
                </NativeSelectOption>
                <NativeSelectOption value="dghn">
                  ĐGNL ĐHQG-HN (HSA)
                </NativeSelectOption>
                <NativeSelectOption value="dgsg">
                  ĐGNL ĐHQG-HCM (V-ACT)
                </NativeSelectOption>
              </NativeSelect>
            </div>

            <div className="flex flex-col gap-1 w-1/3">
              <Label className="ml-1">Năm thi</Label>

              <NativeSelect
                className="w-full"
                value={resYear}
                onChange={(e) => setResYear(e.target.value)}
              >
                <NativeSelectOption value="2025">2025</NativeSelectOption>
                <NativeSelectOption value="2024">2024</NativeSelectOption>
                <NativeSelectOption value="2023">2023</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          <div className="w-full flex flex-col gap-1">
            <Label className="ml-1">Các môn trong tổ hợp</Label>
            <Input
              placeholder="Toán-Lý-Hóa..."
              disabled={resMethodId === "thpt" ? false : true}
              value={resSubjectGroupName}
              onChange={(e) => setResSubjectGroupName(e.target.value)}
              onBlur={(e) => subjectGroupValidator("res")}
            ></Input>
          </div>

          <div className="w-full flex flex-col gap-1">
            <Label className="ml-1">Điểm số</Label>
            <Input
              placeholder="10..."
              value={resScore}
              onBlur={(e) => resScoreValidator(resMethodId, e)}
              onChange={(e) => setResScore(e.target.value)}
            ></Input>
          </div>
        </div>

        <div className="rounded-lg shadow-md p-2 space-y-4">
          <h2 className="text-xl mb-5 font-semibold flex items-center gap-2">
            <ArrowRightToLine className="button-icon" />
            Chọn điểm đích
          </h2>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-2/3">
              <Label className="ml-1">Kỳ thi</Label>

              <NativeSelect
                className="w-full"
                value={destMethodId}
                onChange={(e) => setDestMethodId(e.target.value as MethodId)}
              >
                <NativeSelectOption value="thpt">
                  Tốt nghiệp THPT
                </NativeSelectOption>
                <NativeSelectOption value="dgtd">
                  ĐGTD HUST (TSA)
                </NativeSelectOption>
                <NativeSelectOption value="dghn">
                  ĐGNL ĐHQG-HN (HSA)
                </NativeSelectOption>
                <NativeSelectOption value="dgsg">
                  ĐGNL ĐHQG-HCM (V-ACT)
                </NativeSelectOption>
              </NativeSelect>
            </div>

            <div className="flex flex-col gap-1 w-1/3">
              <Label className="ml-1">Năm thi</Label>

              <NativeSelect
                className="w-full"
                value={destYear}
                onChange={(e) => setDestYear(e.target.value)}
              >
                <NativeSelectOption value="2025">2025</NativeSelectOption>
                <NativeSelectOption value="2024">2024</NativeSelectOption>
                <NativeSelectOption value="2023">2023</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          <div className="w-full flex flex-col gap-1">
            <Label className="ml-1">Các môn trong tổ hợp</Label>
            <Input
              placeholder="Toán-Lý-Hóa..."
              disabled={destMethodId === "thpt" ? false : true}
              value={destSubjectGroupName}
              onChange={(e) => setDestSubjectGroupName(e.target.value)}
              onBlur={(e) => subjectGroupValidator("dest")}
            ></Input>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <Button className="submit-button flex gap-2" onClick={convertScore}>
          <ArrowRightLeft className="button-icon" /> Quy đổi
        </Button>
      </div>

      <div className="shadow w-fit mx-auto border-r border-blue-500">
        <div className="p-3 flex flex-col items-center gap-1">
          <h3>Điểm sau quy đổi</h3>
          <div className="text-2xl font-bold text-blue-500">{destScore}</div>
          <h3>Phân vị</h3>
          <div className="font-semibold text-blue-500">{destPer}</div>
        </div>
        <div className="pattern w-full h-12.5"></div>
      </div>
    </div>
  );
}
