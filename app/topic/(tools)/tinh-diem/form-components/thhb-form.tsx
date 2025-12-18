// components/application-form/HbScoresForm.tsx
"use client";

import { Control, Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ScoreData } from "@/lib/universities/calculators/score-data/score-schema";
import { getSubjectName } from "@/lib/universities/convertors/subjects";

import { base10ScoreValidator } from "@/lib/universities/calculators/score-data/score-schema";

const labels = [
  "HK1 - lớp 10",
  "HK2 - lớp 10",
  "HK1 - lớp 11",
  "HK2 - lớp 11",
  "HK1 - lớp 12",
  "HK2 - lớp 12",
];

export default function ThhbForm({
  control,
  appliedSubjects,
}: {
  control: Control<ScoreData>;
  appliedSubjects: string[];
}) {
  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        <div className="size-full text-badge">HK1 - lớp 10</div>
        <div className="size-full text-badge">HK2 - lớp 10</div>
        <div className="size-full text-badge">HK1 - lớp 11</div>
        <div className="size-full text-badge">HK2 - lớp 11</div>
        <div className="size-full text-badge">HK1 - lớp 12</div>
        <div className="size-full text-badge">HK2 - lớp 12</div>
      </div>

      {appliedSubjects.map((subject) => (
        <div key={subject} className="space-y-2 mt-3">
          <Label className="font-medium">{getSubjectName(subject)}</Label>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {labels.map((label, idx) => (
              <Controller
                key={idx}
                control={control}
                name={`thhb.${subject}.${idx}` as any}
                render={({ field }) => (
                  <Input
                    placeholder={`${label}`}
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      field.onChange(base10ScoreValidator(e.target.value));
                    }}
                  />
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
