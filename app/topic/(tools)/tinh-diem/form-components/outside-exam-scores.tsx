"use client";

import { Control, Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ScoreData,
  candSubjects,
  hscaSubjects,
  vsatSubjects,
} from "@/lib/universities/calculators/score-data/score-schema";
import { getSubjectName } from "@/lib/universities/convertors/subjects";

import {
  base10ScoreValidator,
  scoreValidator,
} from "@/lib/universities/calculators/score-data/score-schema";

export default function OutsideExamScoresForm({
  control,
  appliedSubjects,
}: {
  control: Control<ScoreData>;
  appliedSubjects: string[];
}) {
  const dgsgParts = [
    {
      id: "nv",
      label: "Tiếng Việt",
    },
    {
      id: "an",
      label: "Tiếng Anh",
    },
    {
      id: "to",
      label: "Toán học",
    },
    {
      id: "kh",
      label: "Tư duy khoa học",
    },
  ];
  return (
    <div className="space-y-5">
      {/* DGTD */}
      <div className="space-y-2">
        <Label className="text-badge w-fit">TSA (ĐGTD - HUST)</Label>
        <Controller
          control={control}
          name="dgtd"
          render={({ field }) => (
            <Input
              placeholder="Thang 100"
              {...field}
              onBlur={(e) => {
                field.onBlur();
                field.onChange(scoreValidator(e.target.value, 0, 100, false));
              }}
            />
          )}
        />
      </div>

      {/* DGHN */}
      <div className="space-y-2">
        <Label className="text-badge w-fit">HSA (ĐGNL ĐHQG-HN)</Label>
        <Controller
          control={control}
          name="dghn"
          render={({ field }) => (
            <Input
              placeholder="Thang 150"
              {...field}
              onBlur={(e) => {
                field.onBlur();
                field.onChange(scoreValidator(e.target.value, 0, 150, false));
              }}
            />
          )}
        />
      </div>

      {/* DGSG */}
      <div className="space-y-2">
        <Label className="text-badge w-fit">V-ACT (ĐGNL - ĐHQG-HCM)</Label>
        <div className="grid grid-cols-4 gap-2">
          {dgsgParts.map((node) => (
            <div key={node.id} className="space-y-1">
              <Label className="font-normal">{node.label}</Label>
              <Controller
                key={node.id}
                control={control}
                name={`dgsg.${node.id}` as any}
                render={({ field }) => (
                  <Input
                    placeholder="Thang 300"
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      field.onChange(
                        scoreValidator(e.target.value, 0, 300, true)
                      );
                    }}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* DGSP */}
      <div className="space-y-2">
        <Label className="text-badge w-fit">SPT (ĐGNL HNUE)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(appliedSubjects ?? []).map((subject) => (
            <div key={subject} className="space-y-1">
              <Label className="font-normal">{getSubjectName(subject)}</Label>
              <Controller
                key={subject}
                control={control}
                name={`dgsp.${subject}` as any}
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
      </div>

      {/* DGCB */}
      <div className="space-y-2">
        <Label className="text-badge w-fit">H-SCA (ĐGNLCB HCMUE)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {hscaSubjects
            .filter((subject) => (appliedSubjects ?? []).includes(subject))
            .map((subject) => (
              <div key={subject} className="space-y-1">
                <Label className="font-normal">{getSubjectName(subject)}</Label>
                <Controller
                  key={subject}
                  control={control}
                  name={`dgcb.${subject}` as any}
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
      </div>

      {/* VSAT */}
      <div className="space-y-2">
        <Label className="text-badge w-fit">V-SAT</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {vsatSubjects
            .filter((subject) => (appliedSubjects ?? []).includes(subject))
            .map((subject) => (
              <div key={subject} className="space-y-1">
                <Label className="font-normal">{getSubjectName(subject)}</Label>
                <Controller
                  key={subject}
                  control={control}
                  name={`vsat.${subject}` as any}
                  render={({ field }) => (
                    <Input
                      placeholder="Thang 450"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        field.onChange(
                          scoreValidator(e.target.value, 0, 450, true)
                        );
                      }}
                    />
                  )}
                />
              </div>
            ))}
        </div>
      </div>

      {/* CAND */}
      <div className="space-y-2">
        <Label className="text-badge w-fit">ĐGNL Công an nhân dân (BCA)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {candSubjects
            .filter((subject) => (appliedSubjects ?? []).includes(subject))
            .map((subject) => (
              <div key={subject} className="space-y-1">
                <Label className="font-normal">{getSubjectName(subject)}</Label>
                <Controller
                  key={subject}
                  control={control}
                  name={`dgca.${subject}` as any}
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
      </div>
    </div>
  );
}
