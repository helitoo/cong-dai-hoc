"use client";

import { CirclePlus, Trash } from "lucide-react";

import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { MajorQueries } from "@/lib/universities/calculators/major-finder/major-queries-schema";

import { getExactSchoolFromName } from "@/lib/universities/convertors/schools";

export function SchoolInputText({
  setValue,
}: {
  setValue: UseFormSetValue<MajorQueries>;
}) {
  const [schoolNames, setSchoolNames] = useState<string[]>([]);

  const syncToForm = (names: string[]) => {
    const ids = names
      .map((name) => {
        if (!name.trim()) return null;
        const exact = getExactSchoolFromName(name);
        return exact?.id ?? null;
      })
      .filter(Boolean) as string[];

    setValue("schoolIds", ids, {
      shouldDirty: true,
    });

    // console.log(ids);
  };

  const handleBlur = (index: number) => {
    const next = [...schoolNames];
    const rawName = next[index];

    if (!rawName?.trim()) {
      syncToForm(next);
      return;
    }

    const exact = getExactSchoolFromName(rawName);
    if (!exact) return;

    next[index] = exact.name;

    setSchoolNames(next);

    syncToForm(next);
  };

  const add = () => {
    const next = [...schoolNames, ""];
    setSchoolNames(next);
  };

  const remove = (index: number) => {
    const next = schoolNames.filter((_, i) => i !== index);
    setSchoolNames(next);
    syncToForm(next);
  };

  const updateName = (index: number, value: string) => {
    const next = [...schoolNames];
    next[index] = value;
    setSchoolNames(next);
  };

  return (
    <div className="w-full space-y-2">
      <Label>Tên / tên viết tắt trường ĐH</Label>

      {schoolNames.map((name, index) => (
        <div key={index} className="flex gap-1">
          <Input
            value={name}
            placeholder="ĐH Bách khoa HCM..."
            onChange={(e) => updateName(index, e.target.value)}
            onBlur={() => handleBlur(index)}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
          >
            <Trash className="button-icon text-red-500" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="ghost" size="icon" onClick={add}>
        <CirclePlus className="button-icon text-green-500" />
      </Button>
    </div>
  );
}
