"use client";

import { Control, Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ScoreData } from "@/lib/universities/calculators/score-data/score-schema";
import { getSubjectName } from "@/lib/universities/convertors/subjects";

import { base10ScoreValidator } from "@/lib/universities/calculators/score-data/score-schema";

export default function ThptForm({
  control,
  appliedSubjects,
}: {
  control: Control<ScoreData>;
  appliedSubjects: string[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {(appliedSubjects ?? []).map((subject) => (
        <div key={subject} className="space-y-1">
          <Label>{getSubjectName(subject)}</Label>

          <Controller
            control={control}
            name={`thpt.${subject}` as any}
            render={({ field }) => (
              <Input
                placeholder="Thang 10"
                {...field}
                onBlur={(e) => {
                  field.onBlur();
                  field.onChange(base10ScoreValidator(e.target.value));
                }}
              />
            )}
          />
        </div>
      ))}
    </div>
  );
}
