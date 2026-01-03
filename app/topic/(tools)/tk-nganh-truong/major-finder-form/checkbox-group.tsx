"use client";

import { Control, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxGroupProps {
  name: string;
  label: string;
  options: { label: string; id: string }[];
  control: Control<any>;
  direction?: "vertical" | "horizontal";
}

export function CheckboxGroup({
  name,
  label,
  options,
  control,
  direction = "vertical",
}: CheckboxGroupProps) {
  return (
    <div className="w-full space-y-2">
      <Label>{label}</Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div
            className={`flex ${
              direction === "vertical" ? "flex-col" : "flex-row flex-wrap"
            } gap-2 ml-5`}
          >
            {options.map((opt) => {
              const checked = field.value?.includes(opt.id);

              return (
                <Label
                  key={opt.id}
                  className="flex items-center gap-1 font-normal"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(val) => {
                      if (val) field.onChange([...field.value, opt.id]);
                      else {
                        field.onChange(
                          field.value.filter((v: string) => v !== opt.id)
                        );
                      }
                    }}
                  />
                  {opt.label}
                </Label>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}
