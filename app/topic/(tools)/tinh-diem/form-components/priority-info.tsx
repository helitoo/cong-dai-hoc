"use client";

import { Control, Controller } from "react-hook-form";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <Select
              value={field.value?.toString()}
              defaultValue={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn Khu vực..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="0">Khu vực 3 (KV3)</SelectItem>
                  <SelectItem value="1">Khu vực 2 (KV2)</SelectItem>
                  <SelectItem value="2">
                    Khu vực 2 nông thôn (KV2-NT)
                  </SelectItem>
                  <SelectItem value="3">Khu vực 1 (KV1)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label>Đối tượng ưu tiên</Label>
        <Controller
          control={control}
          name="priority.dt"
          render={({ field }) => (
            <Select
              value={field.value?.toString()}
              defaultValue={field.value?.toString()}
              onValueChange={(v) => field.onChange(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn đối tượng..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="0">Không có</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
}
