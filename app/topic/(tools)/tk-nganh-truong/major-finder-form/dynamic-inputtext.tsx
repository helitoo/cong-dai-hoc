"use client";

import { CirclePlus, Trash } from "lucide-react";
import { Control, Controller, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { BestMatchRes } from "@/lib/universities/general-helpers/get-exact-data";

interface DynamicInputtextProps {
  name: string;
  label: string;
  placeholder: string;
  control: Control<any>;
  getExactDataFormName: (value: string) => BestMatchRes;
}

export function DynamicInputtext({
  name,
  label,
  placeholder,
  control,
  getExactDataFormName,
}: DynamicInputtextProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="w-full space-y-2">
      <Label>{label}</Label>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-1">
          <Controller
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={placeholder}
                onBlur={() => {
                  const rawValue = field.value;
                  if (!rawValue) return;

                  const exact = getExactDataFormName(rawValue);
                  control._formValues[name][index] = exact.id;
                  field.onChange(exact.name);
                }}
              />
            )}
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

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => append("")}
      >
        <CirclePlus className="button-icon text-green-500" />
      </Button>
    </div>
  );
}
