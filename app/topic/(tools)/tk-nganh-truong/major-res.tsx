"use client";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { useState, useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import showToast from "@/components/toastify-wrapper";
import { useLoading } from "@/components/loading";

import type { MajorQueries } from "@/lib/universities/calculators/major-finder/major-queries-schema";
import {
  type ReturnedMajor,
  findMajor,
} from "@/lib/universities/calculators/major-finder/major-finder-handler";

import { getHldData } from "@/lib/localStorage/hld-data";
import { getScoreData } from "@/lib/localStorage/score-data";
import {
  getHldRes,
  getIndustry1FromHld,
} from "@/lib/universities/calculators/holland-data/hld-calculator";
import {
  getScoreRes,
  type ScoreRes,
} from "@/lib/universities/calculators/score-data/score-calculator";

import { getMethodName } from "@/lib/universities/convertors/method";
import {
  getSubjectGroupName,
  type SubjectGroupId,
} from "@/lib/universities/convertors/subject-groups";

function SubjectGroupBoxes({
  methodId,
  subjectGroupIds,
}: {
  methodId: string;
  subjectGroupIds: string[];
}) {
  function getBgColorFromSubjectGroup(groupId: string) {
    if (groupId.startsWith("A")) return "bg-amber-400";

    const seqNumber = Number(groupId.slice(1)) ?? 1;

    if (1 <= seqNumber && seqNumber <= 55) return "bg-cyan-400";
    else if (56 <= seqNumber && seqNumber <= 100) return "bg-teal-400";
    else if (101 <= seqNumber && seqNumber <= 136) return "bg-blue-400";
    else if (137 <= seqNumber && seqNumber <= 164) return "bg-emerald-400";
    else if (165 <= seqNumber && seqNumber <= 185) return "bg-red-400";
    else if (186 <= seqNumber && seqNumber <= 200) return "bg-orange-400";
    else if (201 <= seqNumber && seqNumber <= 210) return "bg-yellow-600";
    else if (211 <= seqNumber && seqNumber <= 216) return "bg-indigo-400";
    else return "bg-blue-300";
  }

  return (
    <>
      {methodId != "dgsg" && methodId != "dghn" && methodId != "dgtd" ? (
        <>
          {subjectGroupIds.map((groupId, index) => (
            <div
              key={index}
              className={`p-1 rounded text-xs text-white ${getBgColorFromSubjectGroup(
                groupId
              )}`}
            >
              {groupId.startsWith("A")
                ? "Môn năng khiếu / Ngoại ngữ"
                : getSubjectGroupName(groupId as SubjectGroupId)}
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

function ReturnedMajors({
  majorQueriesForm,
  rerender,
}: {
  majorQueriesForm: UseFormReturn<MajorQueries>;
  rerender: boolean;
}) {
  const { showLoading, hideLoading } = useLoading();
  const [returnedMajors, setReturnedMajors] = useState<ReturnedMajor[]>([]);
  const [page, setPage] = useState(1); // STT page hien tai
  const [totalPages, setTotalPages] = useState(0); // STT

  useEffect(() => {
    setTotalPages(Math.ceil(returnedMajors.length));
    setPage(1);
  }, [returnedMajors]);

  const pagedMajors = useMemo(() => {
    const start = page - 1;
    const end = start + 1;
    return returnedMajors.slice(start, end);
  }, [returnedMajors, page]);

  useEffect(() => {
    (async () => {
      showLoading();

      const majorQueries: MajorQueries = majorQueriesForm.getValues();
      let hldRcmMajors: Map<string, number> | undefined = undefined;
      let scoreRes: ScoreRes | undefined = undefined;

      try {
        if (majorQueries.applyHldRes) {
          const currHldData = getHldData();
          if (currHldData) {
            const hldRes = getHldRes(JSON.parse(currHldData));
            hldRcmMajors = getIndustry1FromHld(hldRes);
          }
        }

        if (majorQueries.applyScoreRes) {
          const currScoreData = getScoreData();
          if (currScoreData) scoreRes = getScoreRes(JSON.parse(currScoreData));
        }
      } catch (err) {
        showToast({ type: "error", message: "Dữ liệu đầu vào KHÔNG hợp lệ!" });
      }

      const currReturnedMajors = await findMajor(
        majorQueries,
        hldRcmMajors,
        scoreRes
      );

      if (currReturnedMajors && currReturnedMajors.length)
        setReturnedMajors(currReturnedMajors);
      else
        showToast({
          type: "error",
          message: "Dữ liệu hiện không có, hãy thử lại sau.",
        });

      hideLoading();
    })();
  }, [rerender]);

  return (
    <>
      {returnedMajors.length > 0 && (
        <div className="space-y-3">
          <div className="w-full flex items-center justify-center">
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="ghost"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="button-icon" />
              </Button>

              <span className="text-sm">
                {page} / {totalPages}
              </span>

              <Button
                variant="ghost"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="button-icon" />
              </Button>
            </div>
          </div>

          {pagedMajors.map((major) => (
            <div key={major.schoolId}>
              {/* Title */}
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <div className="rounded-full size-10 bg-sky-400 text-white flex items-center justify-center shrink-0">
                  {major.schoolId}
                </div>
                <h2 className="text-xl text-sky-400">{major.schoolName}</h2>
              </div>

              <div className="space-y-5 ml-5">
                {major.majorInfo.map((majorInfo, index) => (
                  <div
                    key={index}
                    className="w-full grid grid-cols-[4fr_1fr_2fr]"
                  >
                    {/* Major info */}
                    <div className="min-w-0 border-b-2 p-1 border-cyan-400">
                      <h3 className="font-semibold wrap-break-word">
                        {majorInfo.majorName}
                      </h3>
                      <h4 className="text-muted-foreground text-sm">
                        {majorInfo.majorId}
                      </h4>
                      <p className="italic text-muted-foreground text-sm wrap-break-word">
                        {majorInfo.note}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="px-2 py-1 text-white font-semibold bg-linear-to-r from-cyan-400 to-sky-500 whitespace-nowrap flex items-center justify-center">
                      {majorInfo.score} đ
                    </div>

                    {/* Method + subject */}
                    <div className="flex flex-wrap gap-2 ml-2">
                      <div className="p-1 rounded text-xs w-fit text-white font-semibold bg-linear-to-r from-sky-500 to-indigo-500">
                        Pt. {getMethodName(majorInfo.methodId)}
                      </div>

                      <SubjectGroupBoxes
                        methodId={majorInfo.methodId}
                        subjectGroupIds={majorInfo.subjectGroupIds}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="w-full flex items-center justify-center">
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="ghost"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="button-icon" />
              </Button>

              <span className="text-sm">
                {page} / {totalPages}
              </span>

              <Button
                variant="ghost"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="button-icon" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function MajorRes({
  majorQueriesForm,
}: {
  majorQueriesForm: UseFormReturn<MajorQueries>;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [rerender, setRerender] = useState(false);

  function viewResButtonHandler() {
    setRerender((prev) => !prev);
    setSubmitted(true);
  }

  return (
    <div className="w-full">
      <Button
        className="my-10 submit-button w-fit mx-auto flex items-center justify-center"
        onClick={viewResButtonHandler}
      >
        <Search className="button-icon" /> Tìm kiếm {submitted ? "lại" : ""}
      </Button>

      {submitted ? (
        <ReturnedMajors
          majorQueriesForm={majorQueriesForm}
          rerender={rerender}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
