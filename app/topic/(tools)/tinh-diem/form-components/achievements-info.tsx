"use client";

import { CirclePlus, Trash } from "lucide-react";
import { Control, Controller, useFieldArray } from "react-hook-form";

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
                <Select
                  value={field.value?.toString()}
                  defaultValue={field.value?.toString()}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn Loại TT..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">Cấp Tỉnh</SelectItem>
                      <SelectItem value="1">Cấp Quốc gia</SelectItem>
                      <SelectItem value="2">Cấp Quốc tế / Khu vực</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="w-2/5 space-y-1">
            <Label>Giải</Label>
            <Controller
              control={control}
              name={`achievements.${idx}.prize`}
              render={({ field }) => (
                <Select
                  value={field.value?.toString()}
                  defaultValue={field.value?.toString()}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn Loại TT..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">Giải Tư / Khuyến khích</SelectItem>
                      <SelectItem value="1">Giải Ba / HC Đồng</SelectItem>
                      <SelectItem value="2">Giải Nhì / HC Bạc</SelectItem>
                      <SelectItem value="3">Giải Nhất / HC Vàng</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
