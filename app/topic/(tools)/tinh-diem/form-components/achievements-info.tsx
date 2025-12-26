"use client";

import { CirclePlus, Trash } from "lucide-react";
import { Control, Controller, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import Quote from "@/components/quote";

import { ScoreData } from "@/lib/universities/calculators/score-data/score-schema";

export default function AchievementsForm({
  control,
}: {
  control: Control<ScoreData>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  return (
    <div className="flex flex-col gap-4">
      <p>
        Chọn các thành tích cuộc thi chọn HSG, Olympic, văn thể mỹ, khoa học kỹ
        thuật,... mà bạn đạt được:
      </p>

      <Quote type="warning">
        Thành tích phải có chứng chỉ chứng nhận. Chứng chỉ chứng nhận thành tích
        phải còn hạn sử dụng cho đến thời điểm đăng ký xét tuyển.
      </Quote>

      {fields.map((field, idx) => (
        <div key={field.id} className="flex gap-2 items-end">
          <div className="w-2/5 space-y-1">
            <Label>Loại thành tích</Label>
            <Controller
              control={control}
              name={`achievements.${idx}.type`}
              render={({ field }) => (
                <NativeSelect
                  className="w-full"
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <NativeSelectOption value="0">Cấp Tỉnh</NativeSelectOption>
                  <NativeSelectOption value="1">
                    Cấp Quốc gia
                  </NativeSelectOption>
                  <NativeSelectOption value="2">
                    Cấp Quốc tế / Khu vực
                  </NativeSelectOption>
                </NativeSelect>
              )}
            />
          </div>

          <div className="w-2/5 space-y-1">
            <Label>Giải</Label>
            <Controller
              control={control}
              name={`achievements.${idx}.prize`}
              render={({ field }) => (
                <NativeSelect
                  className="w-full"
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <NativeSelectOption value="0">
                    Giải Tư / Khuyến khích
                  </NativeSelectOption>
                  <NativeSelectOption value="1">
                    Giải Ba / HC Đồng
                  </NativeSelectOption>
                  <NativeSelectOption value="2">
                    Giải Nhì / HC Bạc
                  </NativeSelectOption>
                  <NativeSelectOption value="3">
                    Giải Nhất / HC Vàng
                  </NativeSelectOption>
                </NativeSelect>
              )}
            />
          </div>
          <Button onClick={() => remove(idx)} variant="ghost" size="icon">
            <Trash className="button-icon text-red-500" />
          </Button>
        </div>
      ))}

      <div className="w-full flex justify-center">
        <Button
          onClick={() => append({ type: 0, prize: 0 })}
          variant="ghost"
          size="icon"
        >
          <CirclePlus className="button-icon text-green-500" />
        </Button>
      </div>
    </div>
  );
}
