"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import Link from "next/link";

import Quote from "@/components/quote";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CheckboxGroup } from "@/app/topic/(tools)/tk-nganh-truong/major-finder-form/checkbox-group";
import { DynamicInputText } from "@/app/topic/(tools)/tk-nganh-truong/major-finder-form/dynamic-input-text";
import { IndustrySelect } from "@/app/topic/(tools)/tk-nganh-truong/major-finder-form/industry-select";
import MajorRes from "@/app/topic/(tools)/tk-nganh-truong/major-res";

import {
  majorQueriesSchema,
  type MajorQueries,
} from "@/lib/universities/calculators/major-finder/major-queries-schema";

import { getExactSchoolFromName } from "@/lib/universities/convertors/schools";
import { getExactSubjectGroupFromName } from "@/lib/universities/convertors/subject-groups";

export default function MajorQueriesForm() {
  const isMobile = useIsMobile();

  const form = useForm<MajorQueries>({
    resolver: zodResolver(majorQueriesSchema),
    defaultValues: {
      schoolIds: [],
      schoolTypes: ["public"],
      schoolRegions: ["HCMC", "HNC"],
      industryL1Ids: [],
      industryL3Ids: [],
      methodIds: [
        "thpt",
        "thhb",
        "dghn",
        "dgsg",
        "dgtd",
        "vsat",
        "dgsp",
        "dgcb",
        "dgca",
        "ccqt",
      ],
      subjectGroupIds: [],
      minScore: 20,
      scoreMargin: 2,
      numberOfReturnedValue: 10,
      applyScoreRes: true,
      applyHldRes: true,
    },
  });

  return (
    <div className="space-y-3 w-full">
      <div className="p-4 shadow-sm">
        <h2 className="text-lg font-semibold pb-2 mb-2">
          Nhập thông tin trường
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="col-span-2 md:col-span-2">
            <DynamicInputText
              setValue={form.setValue}
              getExactValue={getExactSchoolFromName}
              name="schoolIds"
              label="Tên trường / tên viết tắt"
              placeholder="Bách khoa HCM..."
            />
          </div>

          <div className="col-span-1">
            <CheckboxGroup
              label="Loại hình trường"
              name="schoolTypes"
              direction="vertical"
              control={form.control}
              options={[
                { id: "public", label: "Công lập" },
                { id: "private", label: "Tư thục / Dân lập" },
              ]}
            />
          </div>

          <div className="col-span-1">
            <CheckboxGroup
              label="Khu vực"
              name="schoolRegions"
              direction="vertical"
              control={form.control}
              options={[
                { id: "HNC", label: "Hà Nội" },
                { id: "HCMC", label: "TP.HCM" },
                { id: "NR", label: "Miền Bắc" },
                { id: "CR", label: "Miền Trung" },
                { id: "SR", label: "Miền Nam" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="p-4 shadow-sm">
        <h2 className="text-lg font-semibold pb-2 mb-2">
          Thông tin Ngành / Nhóm ngành
        </h2>

        <IndustrySelect setValue={form.setValue} />
      </div>

      <div className="p-4 shadow-sm">
        <h2 className="text-lg font-semibold pb-2 mb-2">
          Thông tin Phương thức / Tổ hợp xét tuyển
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="col-span-1">
            <CheckboxGroup
              label="Phương thức"
              name="methodIds"
              direction={isMobile ? "horizontal" : "vertical"}
              control={form.control}
              options={[
                { id: "thpt", label: "TN THPT" },
                { id: "thhb", label: "HB THPT" },
                { id: "dghn", label: "HSA" },
                { id: "dgsg", label: "V-ACT" },
                { id: "dgtd", label: "TSA" },
                { id: "vsat", label: "V-SAT" },
                { id: "dgsp", label: "SPT" },
                { id: "dgcb", label: "H-SCA" },
                { id: "dgca", label: "ĐGNL BCA" },
                { id: "ccqt", label: "CCQT" },
              ]}
            />
          </div>

          <div className="col-span-1 mt-3">
            <DynamicInputText
              setValue={form.setValue}
              getExactValue={getExactSubjectGroupFromName}
              name="subjectGroupIds"
              label="Các môn trong tổ hợp"
              placeholder="Toán-Lý-Hóa..."
            />
          </div>
        </div>
      </div>

      <div className="p-4 shadow-sm">
        <h2 className="text-lg font-semibold pb-2 mb-2">
          Hiệu chỉnh kết quả tìm kiếm
        </h2>

        <p className="text-sm text-muted-foreground mb-2">
          Mặc định hệ thống tìm các ngành có <strong>điểm ≥ 20</strong> và{" "}
          <strong>≤ điểm của bạn + 2</strong> (thang 30). Bạn có thể điều chỉnh
          phạm vi tại đây.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Điểm thấp nhất</Label>
            <Controller
              control={form.control}
              name="minScore"
              render={({ field }) => (
                <Input
                  onlyShowTruth={false}
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <Label>Độ lệch điểm</Label>
            <Controller
              control={form.control}
              name="scoreMargin"
              render={({ field }) => (
                <Input
                  onlyShowTruth={false}
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <Label>Số trường tối đa trả về</Label>
            <Controller
              control={form.control}
              name="numberOfReturnedValue"
              render={({ field }) => (
                <Input
                  onlyShowTruth={false}
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-5 mt-5 justify-center">
          <Label>
            <Controller
              control={form.control}
              name="applyScoreRes"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div>
              Áp dụng kết quả <Link href="/topic/tinh-diem">Tính Điểm</Link>
            </div>
          </Label>

          <Label>
            <Controller
              control={form.control}
              name="applyHldRes"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div>
              Áp dụng kết quả{" "}
              <Link href="/topic/trac-nghiem-tinh-cach">
                Trắc nghiệm tính cách
              </Link>
            </div>
          </Label>
        </div>
      </div>

      <Quote type="warning">
        Bộ lọc nhóm ngành và khu vực trường có thể vô tình chọn trúng một số
        ngành không liên quan. Các bạn báo cáo bằng cách gửi email cho địa chỉ
        bên dưới. Xin cảm ơn.
      </Quote>

      <MajorRes majorQueriesForm={form} />
    </div>
  );
}
