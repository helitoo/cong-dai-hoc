"use client";

import { Settings, WandSparkles } from "lucide-react";

import Image from "next/image";
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Quote from "@/components/quote";

import { BarChart } from "@/components/charts/bar-charts";

import type { ScoreData } from "@/lib/universities/calculators/score-data/score-schema";
import {
  getSubjectGroupName,
  SubjectGroupId,
} from "@/lib/universities/convertors/subject-groups";

import { round2 } from "@/lib/universities/convertors/score-convertor";

import {
  type ExtraInfo,
  type GroupScoreInfo,
  type ScoreRes,
  getScoreRes,
} from "@/lib/universities/calculators/score-data/score-calculator";

import {
  getDescMainInfoByGroup,
  getGroupStatistics,
} from "@/lib/universities/calculators/score-data/score-statistics";

function ExtraInfo({ extraInfo }: { extraInfo: ExtraInfo }) {
  return (
    <div className="w-full shadow p-3">
      <h3 className="text-lg font-semibold mb-3 w-full flex items-center gap-2">
        <Settings className="size-5" /> Thông tin chung
      </h3>

      <ul className="list-disc">
        <li className="ml-5">
          <strong>Mức điểm ưu tiên</strong>: {extraInfo.get("ut")} (thang 3).
        </li>

        <li className="ml-5">
          <strong>Mức điểm khuyến khích cho thành tích cá nhân</strong>:{" "}
          {extraInfo.get("kk")} (thang 3).
        </li>

        <li className="ml-5">
          <strong>Điểm quy đổi ngoại ngữ</strong> (áp dụng cho Học bạ và TN
          THPT): {extraInfo.get("an")} (thang 10).
        </li>

        <li className="ml-5">
          <strong>
            Điểm trung bình phương thức Chứng chỉ tuyển sinh quốc tế
          </strong>
          : {extraInfo.get("ccqt")} (thang 30).
        </li>
      </ul>
    </div>
  );
}

function getLogoProps(id: string): {
  src: string;
  width: number;
  height: number;
  alt: string;
} {
  switch (id) {
    case "vnuhcm":
      return {
        src: "/uni-logos/dhqg-hcm.png",
        width: 1024,
        height: 716,
        alt: "Logo ĐHQG-HCM",
      };
    case "vnuhn":
      return {
        src: "/uni-logos/dhqg-hn.png",
        width: 1000,
        height: 1000,
        alt: "Logo ĐHQG-HN",
      };
    case "hust":
      return {
        src: "/uni-logos/hust.png",
        width: 1365,
        height: 2048,
        alt: "Logo HUST",
      };
    case "hcmue":
      return {
        src: "/uni-logos/hcmue.png",
        width: 1280,
        height: 622,
        alt: "Logo HCMUE",
      };
    case "hnue":
      return {
        src: "/uni-logos/hnue.png",
        width: 1000,
        height: 1000,
        alt: "Logo HNUE",
      };
    case "bca":
      return {
        src: "/uni-logos/bca.png",
        width: 1024,
        height: 795,
        alt: "Logo BCA",
      };

    default:
      return {
        src: "/uni-logos/bgd.jpg",
        width: 959,
        height: 960,
        alt: "Logo BGD",
      };
  }
}

function ScoreInfo({
  scoreInfo,
  logoId,
  title,
  headers,
}: {
  scoreInfo: GroupScoreInfo;
  logoId: string;
  title: string;
  headers: string[];
}) {
  const { src, width, height, alt } = getLogoProps(logoId);

  return (
    <>
      <div className="w-full shadow p-3 space-y-2">
        <h3 className="text-lg font-semibold mb-3 w-full flex items-center gap-2">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            draggable={false}
            className="h-5 w-auto object-contain"
          />{" "}
          <span className="text-sky-500">{title}</span>
        </h3>

        <Table className="[&_th]:border-r [&_td]:border-r [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0">
          <TableHeader>
            <TableRow>
              {headers.map((label, index) => (
                <TableHead key={index}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(scoreInfo.entries()).map(
              ([subjectGroup, scores], index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {subjectGroup === "root"
                      ? "Điểm gốc"
                      : getSubjectGroupName(subjectGroup)}
                  </TableCell>

                  {scores.map(({ mainScore, extraScore }, index) => (
                    <TableCell key={index}>
                      <strong>{round2(mainScore + extraScore)}</strong>
                      {" ; "}
                      {round2(extraScore, 4)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function ScoreResTables({
  form,
  rerender,
}: {
  form: UseFormReturn<ScoreData>;
  rerender: boolean;
}) {
  const [scoreRes, setScoreRes] = useState<ScoreRes>();

  const [groupStatistics, setGroupStatistics] =
    useState<Map<SubjectGroupId, number>>();

  useEffect(() => {
    const res = getScoreRes(form.getValues());

    setScoreRes({
      ...res,
      mainInfo: getDescMainInfoByGroup(res.mainInfo),
    });
  }, [rerender]);

  useEffect(() => {
    if (scoreRes?.mainInfo)
      setGroupStatistics(getGroupStatistics(scoreRes?.mainInfo));
  }, [scoreRes]);

  return (
    <>
      {scoreRes ? (
        <div className="space-y-3 my-3">
          <ExtraInfo extraInfo={scoreRes.extraInfo} />

          <Quote type="tip">
            Mỗi ô điểm dưới đây đều hiển thị dưới dạng "
            <strong>điểm xét tuyển</strong>; điểm cộng".
          </Quote>

          {scoreRes.mainInfo.get("thhb")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("thhb")!}
              logoId="bgd"
              title="Phương thức thi Học bạ THPT (HB)"
              headers={[
                "Tổ hợp",
                "Hk 1,2 L. 10, 11, 12",
                "Hk 1,2 L. 10, 11 và HK1 L. 12",
                "Hk 1 L. 10, 11, 12",
                "Tb L. 10, 11, 12",
                "Tb L. 10, 11",
                "Tb L. 10, 11 và Hk1 L. 12",
                "Tb L. 12",
              ]}
            />
          ) : (
            <></>
          )}

          {scoreRes.mainInfo.get("thpt")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("thpt")!}
              logoId="bgd"
              title="Phương thức thi Tốt nghiệp THPT (TN)"
              headers={[
                "Tổ hợp",
                "Không có môn chính",
                "Môn chính 1 x2",
                "Môn chính 2",
                "Môn chính 3",
              ]}
            />
          ) : (
            <></>
          )}

          {scoreRes.mainInfo.get("dgtd")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("dgtd")!}
              logoId="hust"
              title="Phương thức thi K00 (ĐHBK HN)"
              headers={["Tổ hợp", "Điểm"]}
            />
          ) : (
            <></>
          )}

          {scoreRes.mainInfo.get("k01")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("k01")!}
              logoId="hust"
              title="Phương thức thi K01 (ĐHBK HN)"
              headers={["Tổ hợp", "Điểm"]}
            />
          ) : (
            <></>
          )}

          {scoreRes.mainInfo.get("dghn")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("dghn")!}
              logoId="vnuhn"
              title="Phương thức thi ĐGNL (HSA, ĐHQG-HN)"
              headers={["Tổ hợp", "Điểm"]}
            />
          ) : (
            <></>
          )}

          {scoreRes.mainInfo.get("vnuhcm")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("vnuhcm")!}
              logoId="vnuhcm"
              title="Phương thức Xét tuyển kết hợp (ĐHQG-HCM)"
              headers={[
                "Tổ hợp \\ Môn chính",
                "Không có",
                "Tiếng Việt",
                "Tiếng Anh",
                "Toán",
                "Tư duy khoa học",
              ]}
            />
          ) : (
            <></>
          )}

          {scoreRes.mainInfo.get("dgsg")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("dgsg")!}
              logoId="vnuhcm"
              title="Phương thức thi ĐGNL (V-ACT, ĐHQG-HCM)"
              headers={["Tổ hợp", "Điểm"]}
            />
          ) : (
            <></>
          )}

          {scoreRes.mainInfo.get("dgsp")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("dgsp")!}
              logoId="hnue"
              title="Phương thức thi ĐGNL (HNUE)"
              headers={[
                "Tổ hợp",
                "Không có môn chính",
                "Môn chính 1",
                "Môn chính 2",
                "Môn chính 3",
              ]}
            />
          ) : (
            <></>
          )}

          {scoreRes.mainInfo.get("dgcb")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("dgcb")!}
              logoId="hcmue"
              title="Phương thức thi ĐGNLCB (H-SCA, HCMUE)"
              headers={["Tổ hợp", "Môn thi 1", "Môn thi 2", "Môn thi 3"]}
            />
          ) : (
            <></>
          )}

          {scoreRes.mainInfo.get("vsat")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("vsat")!}
              logoId="bgd"
              title="Phương thức thi ĐGĐVĐH (V-SAT)"
              headers={["Tổ hợp", "Điểm (chưa quy đổi)"]}
            />
          ) : (
            <></>
          )}

          {scoreRes.mainInfo.get("dgca")!.size > 0 ? (
            <ScoreInfo
              scoreInfo={scoreRes.mainInfo.get("dgca")!}
              logoId="bca"
              title="Phương thức thi TSĐH Công an nhân dân (Bộ Công an)"
              headers={["Tổ hợp", "Điểm"]}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      {groupStatistics ? (
        <BarChart
          title="Các tổ hợp môn có điểm trung bình cao nhất"
          labels={Array.from(groupStatistics.keys()).map((v) =>
            getSubjectGroupName(v)
          )}
          values={Array.from(groupStatistics.values())}
        ></BarChart>
      ) : (
        <></>
      )}
    </>
  );
}

export default function ScoreRes({ form }: { form: UseFormReturn<ScoreData> }) {
  const [submitted, setSubmitted] = useState(false);
  const [rerender, setRerender] = useState(false);

  function viewResButtonHandler() {
    setRerender((prev) => !prev);
    setSubmitted(true);
  }

  return (
    <div className="w-full">
      <Button
        className="mt-5 submit-button w-fit mx-auto flex items-center justify-center"
        onClick={viewResButtonHandler}
      >
        <WandSparkles className="button-icon" /> Xem {submitted ? "lại" : ""}{" "}
        kết quả
      </Button>

      {submitted ? <ScoreResTables form={form} rerender={rerender} /> : <></>}
    </div>
  );
}
