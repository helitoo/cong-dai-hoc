"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { CheckboxGroup } from "@/app/topic/(tools)/tk-nganh-truong/major-finder-form/checkbox-group";
import { DynamicInputtext } from "@/app/topic/(tools)/tk-nganh-truong/major-finder-form/dynamic-inputtext";
import MajorRes from "@/app/topic/(tools)/tk-nganh-truong/major-res";

import { getExactIndustry1FromName } from "@/lib/universities/convertors/industry-l1";
import { getExactIndustry3FromName } from "@/lib/universities/convertors/industry-l3";
import { getExactSchoolFromName } from "@/lib/universities/convertors/schools";

import {
  majorQueriesSchema,
  type MajorQueries,
} from "@/lib/universities/calculators/major-finder/major-queries-schema";

export default function MajorQueriesForm() {
  const form = useForm<MajorQueries>({
    resolver: zodResolver(majorQueriesSchema),
    defaultValues: {
      schoolIds: [],
      schoolTypes: ["public"],
      schoolRegions: ["HCMC", "HNC"],
      industryL1Ids: [],
      industryL3Ids: [],
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

        <div className="flex flex-wrap md:flex-nowrap justify-evenly space-y-3 gap-4">
          <DynamicInputtext
            label="Tên / tên viết tắt trường ĐH"
            placeholder="ĐH Bách khoa HCM..."
            name="schoolIds"
            control={form.control}
            getExactDataFormName={getExactSchoolFromName}
          />

          <div className="flex w-full">
            <CheckboxGroup
              label="Loại hình trường"
              name="schoolTypes"
              control={form.control}
              options={[
                { id: "public", label: "Công lập" },
                { id: "private", label: "Tư thục / Dân lập" },
              ]}
            />

            <CheckboxGroup
              label="Khu vực"
              name="schoolRegions"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicInputtext
            label="Nhóm ngành"
            placeholder="Kỹ thuật..."
            name="industryL1Ids"
            control={form.control}
            getExactDataFormName={getExactIndustry1FromName}
          />

          <DynamicInputtext
            label="Ngành"
            placeholder="Hóa học..."
            name="industryL3Ids"
            control={form.control}
            getExactDataFormName={getExactIndustry3FromName}
          />
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
            <Label>Số ngành tối đa trả về</Label>
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

      <MajorRes majorQueriesForm={form} />
    </div>
  );
}
