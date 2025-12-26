"use client";

import { Control, Controller } from "react-hook-form";

import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import { ScoreData } from "@/lib/universities/calculators/score-data/score-schema";

export default function PriorityForm({
  control,
}: {
  control: Control<ScoreData>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-2">
        <Label>Khu vực ưu tiên</Label>
        <Controller
          control={control}
          name="priority.kv"
          render={({ field }) => (
            <NativeSelect
              value={field.value?.toString()}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full"
            >
              <NativeSelectOption value="0">Khu vực 3 (KV3)</NativeSelectOption>
              <NativeSelectOption value="1">Khu vực 2 (KV2)</NativeSelectOption>
              <NativeSelectOption value="2">
                Khu vực 2 nông thôn (KV2-NT)
              </NativeSelectOption>
              <NativeSelectOption value="3">Khu vực 1 (KV1)</NativeSelectOption>
            </NativeSelect>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>Đối tượng ưu tiên</Label>
        <Controller
          control={control}
          name="priority.dt"
          render={({ field }) => (
            <NativeSelect
              value={field.value?.toString()}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full"
            >
              <NativeSelectOption value="0">Không có</NativeSelectOption>
              <NativeSelectOption value="1">1</NativeSelectOption>
              <NativeSelectOption value="2">2</NativeSelectOption>
              <NativeSelectOption value="3">3</NativeSelectOption>
              <NativeSelectOption value="4">4</NativeSelectOption>
              <NativeSelectOption value="5">5</NativeSelectOption>
              <NativeSelectOption value="6">6</NativeSelectOption>
              <NativeSelectOption value="7">7</NativeSelectOption>
            </NativeSelect>
          )}
        />
      </div>
    </div>
  );
}
