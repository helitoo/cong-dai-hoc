"use client";
import { Control, Controller } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import Quote from "@/components/quote";

import {
  type ScoreData,
  type SubjectId,
  availableSubjects,
} from "@/lib/universities/calculators/score-data/score-schema";
import { getSubjectName } from "@/lib/universities/convertors/subjects";

export default function AppliedSubjects({
  control,
}: {
  control: Control<ScoreData>;
}) {
  const groups: { label: string; subjects: SubjectId[] }[] = [
    { label: "🧮 Khoa học tự nhiên", subjects: [...availableSubjects.khtn] },
    { label: "📚 Khoa học XH & NV", subjects: [...availableSubjects.khxhnv] },
    { label: "💻 Công nghệ", subjects: [...availableSubjects.congnghe] },
  ];

  return (
    <>
      <p className="italic mb-5">
        Chọn các môn mà cậu học ở THPT hoặc các môn học mà bạn muốn xét tuyển
        Đại học.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.label}>
            <h4 className="mb-2 text-badge w-full">{group.label}</h4>

            <div className="flex flex-col gap-2 ml-5">
              {group.subjects.map((subj) => (
                <Controller
                  key={subj}
                  name="appliedSubjects"
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value.includes(subj)}
                          defaultChecked={control._defaultValues.appliedSubjects?.includes(
                            subj
                          )}
                          onCheckedChange={(val) => {
                            const newArr = val
                              ? [...field.value, subj]
                              : field.value.filter((s: string) => s !== subj);
                            field.onChange(newArr);
                          }}
                        />
                        <Label>{getSubjectName(subj)}</Label>
                      </div>
                    );
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Quote type="warning">
        Chỉ các môn học được tích chọn ở mục này mới được hiển thị khung để nhập
        điểm.
      </Quote>
    </>
  );
}
