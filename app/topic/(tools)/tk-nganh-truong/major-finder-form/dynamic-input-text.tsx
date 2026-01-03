"use client";

import { CirclePlus, Trash } from "lucide-react";

import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { MajorQueries } from "@/lib/universities/calculators/major-finder/major-queries-schema";

import { BestMatchRes } from "@/lib/universities/general-helpers/get-exact-data";

type DynamicInputTextProps = {
  setValue: UseFormSetValue<MajorQueries>;
  getExactValue: (name: string) => BestMatchRes;
  name: keyof MajorQueries;
  label: string;
  placeholder: string;
};

export function DynamicInputText({
  setValue,
  getExactValue,
  name,
  label,
  placeholder,
}: DynamicInputTextProps) {
  const [names, setNames] = useState<string[]>([]);

  const syncToForm = (names: string[]) => {
    const ids = names
      .map((name) => {
        if (!name.trim()) return null;
        const exact = getExactValue(name);
        return exact?.id ?? null;
      })
      .filter(Boolean) as string[];

    setValue(name, ids, {
      shouldDirty: true,
    });
  };

  const handleBlur = (index: number) => {
    const next = [...names];
    const rawName = next[index];

    if (!rawName?.trim()) {
      syncToForm(next);
      return;
    }

    const exact = getExactValue(rawName);
    if (!exact) return;

    next[index] = exact.name;

    setNames(next);

    syncToForm(next);
  };

  const add = () => {
    const next = [...names, ""];
    setNames(next);
  };

  const remove = (index: number) => {
    const next = names.filter((_, i) => i !== index);
    setNames(next);
    syncToForm(next);
  };

  const updateName = (index: number, value: string) => {
    const next = [...names];
    next[index] = value;
    setNames(next);
  };

  return (
    <div className="w-full space-y-2">
      <Label>{label}</Label>

      {names.map((name, index) => (
        <div key={index} className="flex gap-1">
          <Input
            value={name}
            placeholder={placeholder}
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
